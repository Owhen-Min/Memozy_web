package site.memozy.memozy_api.domain.quiz.dto;

public record QuizShowJoinEvent(
	String showId,
	String userId,
	String nickname,
	String hostName,
	String collectionName,
	String quizCount
) {

}
