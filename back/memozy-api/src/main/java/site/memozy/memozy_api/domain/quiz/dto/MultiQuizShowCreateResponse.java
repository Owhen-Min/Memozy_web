package site.memozy.memozy_api.domain.quiz.dto;

public record MultiQuizShowCreateResponse(
	String showId,
	String showUrl,
	String hostName,
	String collectionName,
	int quizCount
) {
	public static MultiQuizShowCreateResponse of(
		String showId,
		String showUrl,
		String hostName,
		String collectionName,
		int quizCount
	) {
		return new MultiQuizShowCreateResponse(
			showId,
			showUrl,
			hostName,
			collectionName,
			quizCount
		);
	}
}
