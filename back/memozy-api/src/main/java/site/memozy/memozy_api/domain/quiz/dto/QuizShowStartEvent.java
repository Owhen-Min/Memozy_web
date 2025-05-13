package site.memozy.memozy_api.domain.quiz.dto;

public record QuizShowStartEvent(
	String showId,
	String userId,
	String nickname
) {

}
