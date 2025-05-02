package site.memozy.memozy_api.global.payload.code;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
	// 가장 일반적인 응답 (COMMON)
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON5000", "서버 에러, 관리자에게 문의 바랍니다."),
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMMON400", "잘못된 요청입니다."),
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMMON401", "인증이 필요합니다."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "금지된 요청입니다."),

	// 검증 관련 에러
	VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "VALID401", "입력값이 유효하지 않습니다."),

	// User 에러 (USER)
	MEMBER_NOT_FOUND(HttpStatus.BAD_REQUEST, "USER401", "사용자가 없습니다."),
	MEMBER_DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, "USER402", "이미 사용 중인 이메일입니다.");

	// Quiz 에러 (QUIZ)

	// QuizSource 에러 (QUIZ_SOURCE)

	// History 에러 (HISTORY)

	// Collection 에러 (COLLECTION)

	private final HttpStatus httpStatusCode;
	private final String errorCode;
	private final String errorMsg;

	@Override
	public ErrorStatus getErrorReason() {
		return this;
	}
}
