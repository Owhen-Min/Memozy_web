package site.memozy.memozy_api.domain.quiz.service;

import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAndSessionResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResultResponse;

public interface PersonalQuizService {
	PersonalQuizAndSessionResponse getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly);

	void submitQuizAnswer(int userId, long quizId, PersonalQuizAnswerRequest request);

	PersonalQuizResultResponse getPersonalQuizResult(int userId, int collectionId, String quizSessionId);
}
