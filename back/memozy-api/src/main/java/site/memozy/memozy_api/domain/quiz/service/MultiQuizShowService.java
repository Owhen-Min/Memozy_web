package site.memozy.memozy_api.domain.quiz.service;

import org.springframework.transaction.annotation.Transactional;

import site.memozy.memozy_api.domain.quiz.dto.MultiQuizShowCreateResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizAnswerRequest;

public interface MultiQuizShowService {

	@Transactional
	MultiQuizShowCreateResponse createMultiQuizShow(int userId, int collectionId, int count);

	void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember);

	@Transactional
	void submitAnswer(String showId, String userId, QuizAnswerRequest request);
}
