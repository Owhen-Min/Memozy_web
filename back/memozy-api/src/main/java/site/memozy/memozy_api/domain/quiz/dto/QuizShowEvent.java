package site.memozy.memozy_api.domain.quiz.dto;

public record QuizShowEvent(
	String showId,
	String userId,
	String nickname
) {

}
