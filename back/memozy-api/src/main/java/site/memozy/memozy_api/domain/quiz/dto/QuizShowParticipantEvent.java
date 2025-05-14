package site.memozy.memozy_api.domain.quiz.dto;

public record QuizShowParticipantEvent(
	String showId,
	String userId,
	String nickname
) {
}
