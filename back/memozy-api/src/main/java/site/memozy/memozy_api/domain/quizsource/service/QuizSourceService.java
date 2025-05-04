package site.memozy.memozy_api.domain.quizsource.service;

import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;

public interface QuizSourceService {

	String summarizeMarkdown(QuizSourceCreateRequest request);

	Integer saveQuizSourceSummary(QuizSourceCreateRequest request, Integer userId);
}
