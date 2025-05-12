package site.memozy.memozy_api.domain.quiz.dto;

public record MostWrongQuizResultResponse(
	String content,
	String answer,
	String commentary,
	double wrongRate
) {
}
