package site.memozy.memozy_api.domain.quiz.service;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAndSessionResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResultResponse;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quiz.util.QuizSessionStore;

//TODO: 퀴즈 문제 제출 시, 유효성 검사 로직 추가하기
@Service
@RequiredArgsConstructor
public class PersonalQuizServiceImpl implements PersonalQuizService {
	private final QuizRepository quizRepository;
	private final RedisTemplate<String, Object> redisTemplate;
	private final CollectionRepository collectionRepository;

	private final QuizSessionStore quizSessionStore;

	@Override
	public PersonalQuizAndSessionResponse getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly) {
		List<PersonalQuizResponse> personalQuizzes = quizRepository.getPersonalQuizzes(userId, collectionId, count,
			newOnly);
		// TODO: 유효성 체크하고 넘기기(요청한 퀴즈보다 개수가 적거나 그러면 어떻게 할까?)

		// quizList 초기화
		List<String> quizList = personalQuizzes.stream()
			.map(quiz -> String.valueOf(quiz.getQuizId()))
			.toList();

		Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
			.orElseThrow(() -> new RuntimeException("Collection not found"));

		// Redis에 퀴즈 정보 초기화
		String sessionId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
		quizSessionStore.saveQuizSession(userId, quizList, sessionId, collection.getCollectionId());

		return PersonalQuizAndSessionResponse.of(sessionId, personalQuizzes, personalQuizzes.size());
	}

	@Override
	public void submitQuizAnswer(int userId, long quizId, PersonalQuizAnswerRequest request) {
		String key = userId + ":" + request.getQuizSessionId() + ":quizData";
		quizSessionStore.updateQuizStatus(userId, request.getQuizSessionId(), Long.toString(quizId),
			request.getUserAnswer(),
			request.getIsCorrect());
	}

	@Override
	public PersonalQuizResultResponse getPersonalQuizResult(int userId, int collectionId, String quizSessionId) {
		HashMap<String, Object> sessionMap = (HashMap<String, Object>)quizSessionStore.getQuizSession(userId,
			quizSessionId);
		System.out.println(sessionMap);
		return null;
	}
}
