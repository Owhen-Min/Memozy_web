package site.memozy.memozy_api.domain.quiz.dto;

public record QuizAnswerRequest(
	String type,
	int index,
	boolean isCorrect,
	String choice
) {
}
