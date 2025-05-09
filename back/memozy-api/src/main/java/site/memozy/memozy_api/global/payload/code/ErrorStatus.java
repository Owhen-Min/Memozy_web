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
	MEMBER_DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, "USER402", "이미 사용 중인 이메일입니다."),

	// Quiz 에러 (QUIZ)
	QUIZ_VALID_SUMMARY(HttpStatus.BAD_REQUEST, "QUIZ400", "퀴즈 요약이 유효하지 않습니다."),
	QUIZ_NOT_CREATE(HttpStatus.BAD_REQUEST, "QUIZ401", "퀴즈를 생성할 수 없습니다."),
	QUIZ_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "QUIZ402", "이미 퀴즈가 존재합니다."),
	QUIZ_CREATE_ERROR(HttpStatus.BAD_REQUEST, "QUIZ403", "퀴즈 생성에 일시적 오류가 있습니다. 잠시 후 다시 시도해주세요."),

	// QuizSource 에러 (QUIZ_SOURCE)
	QUIZ_SOURCE_EXISTS(HttpStatus.BAD_REQUEST, "QUIZ_SOURCE400", "이미 저장된 데이터입니다."),
	QUIZ_SOURCE_NOT_FOUND(HttpStatus.BAD_REQUEST, "QUIZ_SOURCE401", "해당 데이터가 없습니다."),

	// History 에러 (HISTORY)

	// Collection 에러 (COLLECTION)
	COLLECTION_NOT_FOUND(HttpStatus.BAD_REQUEST, "COLLECTION400", "해당 컬렉션이 없습니다.");

	private final HttpStatus httpStatusCode;
	private final String errorCode;
	private final String errorMsg;

	@Override
	public ErrorStatus getErrorReason() {
		return this;
	}
}
