package site.memozy.memozy_api.domain.quiz.dto;

import lombok.Getter;

@Getter
public class PersonalQuizResultResponse {
	private int totalQuizCount;
	private int incorrectQuizCount;
	private int attemptNumber;
}
