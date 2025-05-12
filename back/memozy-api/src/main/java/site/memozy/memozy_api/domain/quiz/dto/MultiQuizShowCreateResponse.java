package site.memozy.memozy_api.domain.quiz.dto;

public record MultiQuizShowCreateResponse(
	String showId,
	int userId,
	String collectionName,
	int quizCount
) {
	public static MultiQuizShowCreateResponse of(
		String showId,
		int userId,
		String collectionName,
		int quizCount
	) {
		return new MultiQuizShowCreateResponse(
			showId,
			userId,
			collectionName,
			quizCount
		);
	}
}
