package site.memozy.memozy_api.domain.quiz.dto;

public record TopQuizResultResponse(
	int rank,
	String name,
	int score
) {
}
