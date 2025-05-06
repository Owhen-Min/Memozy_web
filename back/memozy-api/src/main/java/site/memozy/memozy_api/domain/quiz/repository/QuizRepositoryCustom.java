package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;

import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;

public interface QuizRepositoryCustom {

	List<QuizSelectResponse> findAllQuizBySourceId(Integer sourceId);
}
