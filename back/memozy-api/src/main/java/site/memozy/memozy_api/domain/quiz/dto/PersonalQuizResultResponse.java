package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class PersonalQuizResultResponse {
	private final int totalQuizCount;
	private final int myWrongQuizCount;
	private final int round;
	private final int point;
	private final List<String> incorrectQuizList;
	private final int previousPoint;
	private final String collectionName;

	private PersonalQuizResultResponse(int totalQuizCount, int myWrongQuizCount, int round,
		int point, List<String> incorrectQuizList, int previousPoint, String collectionName) {
		this.totalQuizCount = totalQuizCount;
		this.myWrongQuizCount = myWrongQuizCount;
		this.round = round;
		this.point = point;
		this.incorrectQuizList = incorrectQuizList;
		this.previousPoint = previousPoint;
		this.collectionName = collectionName;
	}

	public static PersonalQuizResultResponse of(int totalQuizCount, int myWrongQuizCount, int round, int point,
		List<String> incorrectQuizList, int previousPoint, String collectionName) {
		return new PersonalQuizResultResponse(totalQuizCount, myWrongQuizCount, round, point, incorrectQuizList,
			previousPoint, collectionName);
	}
}
