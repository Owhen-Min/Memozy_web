package site.memozy.memozy_api.domain.quiz.service;

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
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quiz.util.QuizSessionStore;

@Service
@RequiredArgsConstructor
public class PersonalQuizServiceImpl implements PersonalQuizService {
	private final QuizRepository quizRepository;
	private final RedisTemplate<String, Object> redisTemplate;
	private final CollectionRepository collectionRepository;
	private final HistoryRepository historyRepository;

	private final QuizSessionStore quizSessionStore;

	@Override
	public PersonalQuizAndSessionResponse getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly) {
		List<PersonalQuizResponse> personalQuizzes = quizRepository.getPersonalQuizzes(userId, collectionId, count,
			newOnly);

		if (personalQuizzes.isEmpty() || personalQuizzes.size() < count) {
			throw new RuntimeException("비상 비상 요청한 수보다 퀴즈 개수가 적다!!!");
		}

		// quizList 초기화
		List<String> quizList = personalQuizzes.stream()
			.map(quiz -> String.valueOf(quiz.getQuizId()))
			.toList();

		Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
			.orElseThrow(() -> new RuntimeException("비상 비상 Collection not found"));

		// Redis에 퀴즈 정보 초기화
		String sessionId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
		quizSessionStore.saveQuizSession(userId, quizList, sessionId, collection.getCollectionId());

		return PersonalQuizAndSessionResponse.of(collection.getName(), sessionId, personalQuizzes,
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
		int nextRound = historyRepository.findMaxHistoryIdByCollectionId(collectionId)
			.orElse(0) + 1;
		int totalQuizCount = quizStatus.size();
		int incorrectQuizCount = 0;
		List<History> historyList = new ArrayList<>();
		for (Map.Entry<String, Map<String, String>> entry : quizStatus.entrySet()) {
			Map<String, String> status = entry.getValue();

			String correctStr = status.get("correct");
			boolean isSolved = correctStr != null && correctStr.equalsIgnoreCase("true");

			if (!isSolved) {
				incorrectQuizCount++;
			}

			historyList.add(History.builder().isSolved(isSolved)
				.userSelect(status.get("answer"))
				.quizId(Long.parseLong(entry.getKey()))
				.collectionId(collectionId)
				.round(nextRound)
				.build());
		}
		historyRepository.saveAll(historyList);

		quizSessionStore.deleteQuizSession(userId, quizSessionId);

		int correctCount = totalQuizCount - incorrectQuizCount;
		int point = (int)Math.round(((double)correctCount / totalQuizCount) * 100);

		return PersonalQuizResultResponse.of(totalQuizCount, incorrectQuizCount, nextRound, point);

	}
}
