package site.memozy.memozy_api.domain.quiz.dto;

public record MyMultiQuizShowResultResponse(
	String type,
	String userId,
	String nickname,
	int myCorrectQuizCount,
	int totalQuizCount,
	int myScore
) {
	public MyMultiQuizShowResultResponse(String userId, String nickname, int correct, int total, int score) {
		this("MYRESULT", userId, nickname, correct, total, score);
	}
}

