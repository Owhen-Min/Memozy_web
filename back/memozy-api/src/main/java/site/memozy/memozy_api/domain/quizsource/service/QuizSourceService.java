package site.memozy.memozy_api.domain.quizsource.service;

import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceResponse;

public interface QuizSourceService {

	String summarizeMarkdown(QuizSourceCreateRequest request);

	Integer saveQuizSourceSummary(QuizSourceCreateRequest request, Integer userId);

	QuizSourceResponse getQuizSourceById(Integer sourceId, Integer userId);
}
