package site.memozy.memozy_api.domain.quiz.dto;

import lombok.Getter;

@Getter
public class PersonalQuizResultResponse {
	private final int totalQuizCount;
	private final int myWrongQuizCount;
	private final int round;
	private final int point;

	private PersonalQuizResultResponse(int totalQuizCount, int myWrongQuizCount, int round,
		int point) {
		this.totalQuizCount = totalQuizCount;
		this.myWrongQuizCount = myWrongQuizCount;
		this.round = round;
		this.point = point;
	}

	public static PersonalQuizResultResponse of(int totalQuizCount, int myWrongQuizCount, int round, int point) {
		return new PersonalQuizResultResponse(totalQuizCount, myWrongQuizCount, round, point);
	}
}
