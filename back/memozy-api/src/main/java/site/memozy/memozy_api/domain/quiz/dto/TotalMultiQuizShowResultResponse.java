package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

public record TotalMultiQuizShowResultResponse(
	String type,
	String wrongQuizResultResponse,
	List<TopQuizResultResponse> topQuizResultResponse
) {
}
