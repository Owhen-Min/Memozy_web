package site.memozy.memozy_api.domain.quiz.service;

import java.util.List;

import site.memozy.memozy_api.domain.quiz.dto.QuizCreateRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizRebuildRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;

public interface QuizService {

	QuizResponse createQuiz(Integer userId, Integer sourceId, QuizCreateRequest request);

	void deleteQuiz(Integer userId, Integer sourceId);

	List<QuizSelectResponse> getQuizList(Integer userId, Integer sourceId);

	List<QuizSelectResponse> rebuildQuiz(Integer userId, Integer sourceId, QuizRebuildRequest request);
}
