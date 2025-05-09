package site.memozy.memozy_api.domain.quiz.dto;

import lombok.Getter;

@Getter
public class PersonalQuizResultResponse {
	private final int totalQuizCount;
	private final int incorrectQuizCount;
	private final int attemptNumber;

	private PersonalQuizResultResponse(int totalQuizCount, int incorrectQuizCount, int attemptNumber) {
		this.totalQuizCount = totalQuizCount;
		this.incorrectQuizCount = incorrectQuizCount;
		this.attemptNumber = attemptNumber;
	}

	public static PersonalQuizResultResponse of(int totalQuizCount, int incorrectQuizCount, int attemptNumber) {
		return new PersonalQuizResultResponse(totalQuizCount, incorrectQuizCount, attemptNumber);
	}
}
