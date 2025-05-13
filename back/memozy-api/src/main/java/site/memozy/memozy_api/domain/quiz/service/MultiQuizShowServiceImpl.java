package site.memozy.memozy_api.domain.quiz.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizShowCreateResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowEvent;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
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

	@Override
	@Transactional
	public MultiQuizShowCreateResponse createMultiQuizShow(CustomOAuth2User user, int collectionId, int count) {
		Collection collection = collectionRepository.findById(collectionId)
			.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));

		String quizShowCode = generateRandomCode();
		log.info("생성된 퀴즈 코드: {}", quizShowCode);
		collection.setCode(quizShowCode);

		List<MultiQuizResponse> quizzes = quizRepository.getMultiQuizzes(user.getUserId(), collectionId, count);
		log.info("quizzes count: {}", quizzes.size());
		if (quizzes.isEmpty() || quizzes.size() < count) {
			throw new GeneralException(QUIZ_COUNT_NOT_ENOUGH);
		}

		multiQuizShowRedisRepository.saveQuizzes(quizShowCode, collectionId, user.getUserId(), count, quizzes);
		String showUrl = String.format("https://memozy.site/quiz/show/%s", quizShowCode);
		return new MultiQuizShowCreateResponse(quizShowCode, showUrl, user.getName(), collection.getName(), count);
	}

	@Override
	public void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember) {
		log.info("[service] joinMultiQuizShow() called with showId: {}", showId);

		if (!collectionRepository.existsByCode(showId)) {
			throw new IllegalArgumentException("Invalid code" + showId);
		}

		Map<String, String> participantInfo = Map.of(
			"nickname", nickname,
			"userId", userId,
			"member", String.valueOf(isMember)
		);

		multiQuizShowRedisRepository.saveParticipant(showId, userId);
		multiQuizShowRedisRepository.saveParticipantInfo(showId, userId, participantInfo);

		applicationEventPublisher.publishEvent(new QuizShowEvent(showId, userId, nickname));
	}

	@Override
	@Transactional
	public void submitAnswer(String showId, String userId, QuizAnswerRequest request) {
		if (!collectionRepository.existsByCode(showId)) {
			throw new IllegalArgumentException("Invalid code" + showId);
		}
		multiQuizShowRedisRepository.saveParticipantAnswer(showId, userId, request.index(), request.choice(),
			request.isCorrect());
	}

	private String generateRandomCode() {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		return uuid.substring(0, 6);
	}
}
