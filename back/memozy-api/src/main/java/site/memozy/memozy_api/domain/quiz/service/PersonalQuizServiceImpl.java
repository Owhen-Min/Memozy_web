package site.memozy.memozy_api.domain.quiz.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.history.entity.History;
import site.memozy.memozy_api.domain.history.repository.HistoryRepository;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAndSessionResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResultResponse;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quiz.util.QuizSessionStore;
import site.memozy.memozy_api.domain.user.User;
import site.memozy.memozy_api.domain.user.repository.UserRepository;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Service
@RequiredArgsConstructor
public class PersonalQuizServiceImpl implements PersonalQuizService {
	private final QuizRepository quizRepository;
	private final RedisTemplate<String, Object> redisTemplate;
	private final CollectionRepository collectionRepository;
	private final HistoryRepository historyRepository;

	private final QuizSessionStore quizSessionStore;
	private final UserRepository userRepository;

	@Override
	@Transactional(readOnly = true)
	public PersonalQuizAndSessionResponse getPersonalQuizzes(int userId, Integer collectionId, int count,
		boolean newOnly) {
		List<PersonalQuizResponse> personalQuizzes = quizRepository.getPersonalQuizzes(userId, collectionId, count,
			newOnly);

		if (personalQuizzes == null || personalQuizzes.isEmpty() || personalQuizzes.size() < count) {
			throw new GeneralException(QUIZ_COUNT_NOT_ENOUGH);
		}

		// quizList 초기화
		List<String> quizList = personalQuizzes.stream()
			.map(quiz -> String.valueOf(quiz.getQuizId()))
			.toList();

		// 기본값 설정
		int effectiveCollectionId = collectionId;
		String effectiveCollectionName = "전체";

		if (collectionId > 0) {
			// 실제 Collection 조회
			Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
				.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));

			effectiveCollectionId = collection.getCollectionId();
			effectiveCollectionName = collection.getName();
		}

		// Redis에 퀴즈 정보 초기화
		String sessionId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
		quizSessionStore.saveQuizSession(userId, quizList, sessionId, effectiveCollectionId);

		return PersonalQuizAndSessionResponse.of(effectiveCollectionName, sessionId, personalQuizzes,
			personalQuizzes.size());
	}

	@Override
	public void submitQuizAnswer(int userId, long quizId, PersonalQuizAnswerRequest request) {
		quizSessionStore.updateQuizStatus(userId, request.getQuizSessionId(), Long.toString(quizId),
			request.getUserAnswer(),
			request.getIsCorrect());
	}

	@Override
	@Transactional
	public PersonalQuizResultResponse getPersonalQuizResult(int userId, String quizSessionId) {
		HashMap<String, Object> sessionMap = (HashMap<String, Object>)quizSessionStore.getQuizSession(userId,
			quizSessionId);

		@SuppressWarnings("unchecked")
		Map<String, Map<String, String>> quizStatus = (Map<String, Map<String, String>>)sessionMap.get(
			QuizSessionStore.QUIZ_STATUS_KEY);

		@SuppressWarnings("unchecked")
		Map<String, String> meta = (Map<String, String>)sessionMap.get(QuizSessionStore.METADATA_KEY);

		int collectionId = Integer.parseInt(meta.get("collectionId"));
		String email = null;
		if (collectionId == 0) {
			User user = userRepository.findById(userId)
				.orElseThrow(() -> new GeneralException(MEMBER_NOT_FOUND));
			email = user.getEmail();
		}

		int nextRound = historyRepository.findMaxHistoryIdByCollectionId(collectionId, email)
			.orElse(0) + 1;
		List<Long> incorrectQuizIds = new ArrayList<>();
		List<History> historyList = new ArrayList<>();
		for (Map.Entry<String, Map<String, String>> entry : quizStatus.entrySet()) {
			Map<String, String> status = entry.getValue();

			String correctStr = status.get("correct");
			boolean isSolved = correctStr != null && correctStr.equalsIgnoreCase("true");

			if (!isSolved) {
				incorrectQuizIds.add(Long.parseLong(entry.getKey()));
			}

			History history = History.builder().isSolved(isSolved)
				.userSelect(status.get("answer"))
				.quizId(Long.parseLong(entry.getKey()))
				.collectionId(collectionId)
				.round(nextRound)
				.build();
			if (collectionId == 0 && email != null) {
				history.updateEmail(email);
			}
			historyList.add(history);
		}
		historyRepository.saveAll(historyList);

		int totalQuizCount = quizStatus.size();
		int correctCount = totalQuizCount - incorrectQuizIds.size();
		int point = calculateScore(totalQuizCount, correctCount);

		List<String> incorrectQuizList = quizRepository.findByQuizIdIn(incorrectQuizIds)
			.stream().map(Quiz::getContent).toList();

		quizSessionStore.deleteQuizSession(userId, quizSessionId);

		List<History> histories = historyRepository.findByCollectionIdAndRound(collectionId, nextRound - 1);
		int previousRoundTotalCount = histories.size();
		long previousRoundSolvedCount = histories.stream().filter(History::getIsSolved).count();
		int previousPoint = calculateScore(previousRoundTotalCount, (int)previousRoundSolvedCount);

		return PersonalQuizResultResponse.of(totalQuizCount, incorrectQuizIds.size(), nextRound, point,
			incorrectQuizList, previousPoint);

	}

	private int calculateScore(int totalCount, int correctCount) {
		return (int)Math.round(((double)correctCount / totalCount) * 100);
	}
}
