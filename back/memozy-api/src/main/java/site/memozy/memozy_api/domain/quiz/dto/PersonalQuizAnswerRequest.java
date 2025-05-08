package site.memozy.memozy_api.domain.quiz.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PersonalQuizAnswerRequest {
	private String quizSessionId;
	private String userAnswer;
	private Boolean isCorrect;
}
