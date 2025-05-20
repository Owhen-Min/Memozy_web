package site.memozy.memozy_api.domain.quiz.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.collection.service.CollectionService;
import site.memozy.memozy_api.domain.history.entity.History;
import site.memozy.memozy_api.domain.history.repository.HistoryRepository;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizShowCreateResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowJoinEvent;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowParticipantEvent;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowStartEvent;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;
import site.memozy.memozy_api.global.payload.exception.GeneralException;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiQuizShowServiceImpl implements MultiQuizShowService {

	private final MultiQuizShowRedisRepository multiQuizShowRedisRepository;
	private final CollectionRepository collectionRepository;
	private final QuizRepository quizRepository;
	private final ApplicationEventPublisher applicationEventPublisher;
	private final MultiQuizShowRunner multiQuizShowRunner;
	private final CollectionService collectionService;
	private final QuizSourceRepository quizSourceRepository;
	private final HistoryRepository historyRepository;
	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	@Transactional
	public MultiQuizShowCreateResponse createMultiQuizShow(CustomOAuth2User user, int collectionId, int count) {
		Collection collection = collectionRepository.findById(collectionId)
			.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));

		if (!collection.getUserId().equals(user.getUserId())) {
			throw new GeneralException(COLLECTION_INVALID_USER);
		}
		log.info("[service] createMultiQuizShow() called user = {} with collectionId: {}, count: {}", user.getUserId(),
			collectionId, count);
		List<MultiQuizResponse> quizzes = quizRepository.getMultiQuizzes(user.getUserId(), collectionId, count);
		log.info("quizzes count: {}", quizzes.size());
		if (quizzes.isEmpty() || quizzes.size() < count) {
			throw new GeneralException(QUIZ_COUNT_NOT_ENOUGH);
		}

		String quizShowCode = generateRandomCode();
		log.info("생성된 퀴즈 코드: {}", quizShowCode);
		collection.setCode(quizShowCode);

		multiQuizShowRedisRepository.saveQuizzes(user.getUserId(), quizShowCode, collection.getCollectionId(),
			collection.getName(), user.getName(),
			count, quizzes);
		String showUrl = String.format("https://memozy.site/quiz/show/%s", quizShowCode);
		return new MultiQuizShowCreateResponse(quizShowCode, showUrl, user.getName(), collection.getName(), count);
	}

	@Override
	public void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember) {
		log.info("[service] joinMultiQuizShow() called with showId: {}", showId);

		if (!collectionRepository.existsByCode(showId)) {
			throw new GeneralException(QUIZ_CODE_NOT_FOUND);
		}

		if (!multiQuizShowRedisRepository.getQuizMetaData(showId).get("status").equals("WAITING")) {
			throw new GeneralException(QUIZ_CANNOT_JOIN);
		}

		Map<String, String> participantInfo = Map.of(
			"nickname", nickname,
			"userId", userId,
			"member", String.valueOf(isMember)
		);

		multiQuizShowRedisRepository.saveParticipant(showId, userId);
		multiQuizShowRedisRepository.saveParticipantInfo(showId, userId, participantInfo);

		Map<String, String> metaData = multiQuizShowRedisRepository.getQuizMetaData(showId);
		applicationEventPublisher.publishEvent(
			new QuizShowJoinEvent(showId, userId, nickname, metaData.get("hostName"), metaData.get("collectionName"),
				metaData.get("quizCount")));
	}

	@Override
	@Transactional
	public void saveQuizShowCollection(String showId, Integer userId, String email) {
		if (!collectionRepository.existsByCode(showId)) {
			throw new GeneralException(QUIZ_CODE_NOT_FOUND);
		}
		Map<String, String> metaData = multiQuizShowRedisRepository.getQuizMetaData(showId);
		if (metaData.isEmpty()) {
			throw new GeneralException(QUIZ_CODE_NOT_FOUND);
		}

		String hostName = metaData.get("hostName");
		String collectionName = metaData.get("collectionName");
		String newCollectionName = collectionName + "(복사본-" + hostName + ")";
		Integer hostId = Integer.parseInt(metaData.get("hostId"));
		Integer collectionId = Integer.parseInt(metaData.get("collectionId"));

		Collection newCollection;

		if (userId.equals(hostId)) {
			newCollection = collectionRepository.findById(collectionId)
				.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));
		} else {
			newCollection = collectionRepository.findByNameAndUserId(newCollectionName, userId)
				.orElseGet(() -> collectionRepository.save(Collection.create(newCollectionName, userId)));

			log.info("상대 collectionId: {}", collectionId);

			List<QuizSource> existingMemozies = quizSourceRepository.findByCollectionId(
				newCollection.getCollectionId());
			List<String> existingMemozyUrls = existingMemozies.stream()
				.map(QuizSource::getUrl)
				.toList();

			List<Integer> quizSourceIds = quizSourceRepository.findByCollectionId(collectionId).stream()
				.filter(source -> !existingMemozyUrls.contains(source.getUrl()))
				.map(QuizSource::getSourceId)
				.toList();

			collectionService.copyQuizShowMemozies(userId, newCollection.getCollectionId(), quizSourceIds);
		}

		saveHistory(showId, userId, email, newCollection.getCollectionId(), metaData);
	}

	@Override
	@Transactional
	public void startMultiQuizShow(String showId, String userId) {
		if (!collectionRepository.existsByCode(showId)) {
			throw new GeneralException(QUIZ_CODE_NOT_FOUND);
		}

		String hostUserId = multiQuizShowRedisRepository.getQuizMetaData(showId).get("hostId");
		if (!hostUserId.equals(userId)) {
			throw new GeneralException(QUIZ_NOT_HOST);
		}
		applicationEventPublisher.publishEvent(new QuizShowStartEvent(showId));
		multiQuizShowRunner.startQuizShow(showId);
	}

	@Override
	@Transactional
	public void submitAnswer(String showId, String userId, QuizAnswerRequest request) {
		if (!collectionRepository.existsByCode(showId)) {
			throw new GeneralException(QUIZ_CODE_NOT_FOUND);
		}
		multiQuizShowRedisRepository.saveParticipantAnswer(showId, userId, request.index(), request.choice(),
			request.isCorrect());
	}

	@Override
	public void changeNickname(String showId, String userId, boolean isMember, String nickname) {
		if (isMember) {
			throw new GeneralException(QUIZ_NICKNAME_CANNOT_CHANGE);
		}
		log.info("[service] changeNickname() called with showId: {}, userId: {}, nickname : {}", showId, userId,
			nickname);
		multiQuizShowRedisRepository.updateParticipantNickname(showId, userId, nickname);
		applicationEventPublisher.publishEvent(new QuizShowParticipantEvent(showId, userId, nickname));
	}

	private String generateRandomCode() {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		return uuid.substring(0, 6);
	}

	private void saveHistory(String showId, Integer userId, String email, Integer collectionId,
		Map<String, String> metaData) {
		int nextRound = historyRepository.findMaxHistoryIdByCollectionId(collectionId, email)
			.orElse(0) + 1;

		Map<String, Map<String, Object>> userAnswer = multiQuizShowRedisRepository.getUserChoice(showId,
			String.valueOf(userId));
		int quizCount = Integer.parseInt(metaData.get("quizCount"));

		for (int i = 0; i < quizCount; i++) {
			Map<String, Object> quizData = multiQuizShowRedisRepository.getQuizByIndex(showId, i);
			String content = (String)quizData.get("content");

			Map<String, Object> choiceData = userAnswer.getOrDefault(String.valueOf(i), Map.of(
				"userAnswer", "",
				"isCorrect", false
			));

			String userAnswerText = (String)choiceData.getOrDefault("userAnswer", "");
			Boolean isCorrect = (Boolean)choiceData.getOrDefault("isCorrect", false);

			Long quizId = quizRepository.findByCollectionIdAndContent(collectionId, content)
				.orElseThrow(() -> new GeneralException(QUIZ_NOT_FOUND));

			History history = History.builder()
				.isSolved(isCorrect)
				.userSelect(userAnswerText)
				.quizId(quizId)
				.collectionId(collectionId)
				.round(nextRound)
				.email(email)
				.build();

			historyRepository.save(history);

		}
	}
}
