package site.memozy.memozy_api.domain.quiz.entity;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.QUIZ_NOT_CREATE;

import lombok.AllArgsConstructor;
import lombok.Getter;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Getter
@AllArgsConstructor
public enum QuizType {

	MULTIPLE_CHOICE("사지선다"),
	OBJECTIVE("단답형"),
	OX("OX퀴즈");

	private final String typeDescription;

	public static QuizType fromCode(int code) {
		return switch (code) {
			case 1 -> MULTIPLE_CHOICE;
			case 2 -> OBJECTIVE;
			case 3 -> OX;
			default -> throw new GeneralException(QUIZ_NOT_CREATE);
		};
	}
}
