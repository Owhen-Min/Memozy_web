package site.memozy.memozy_api.domain.quizsource.service;

import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;

public interface QuizSourceService {

	public String summarizeMarkdown(QuizSourceCreateRequest request);
}
