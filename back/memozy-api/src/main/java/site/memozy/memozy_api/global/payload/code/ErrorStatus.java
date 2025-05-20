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
	QUIZ_ALREADY_CREATE_COUNT(HttpStatus.BAD_REQUEST, "QUIZ404", "퀴즈 생성 수를 초과했습니다."),
	QUIZ_CODE_NOT_FOUND(HttpStatus.BAD_REQUEST, "QUIZ405", "해당 퀴즈 코드가 존재하지 않습니다."),
	QUIZ_NOT_HOST(HttpStatus.BAD_REQUEST, "QUIZ406", "해당 퀴즈의 호스트가 아닙니다."),
	QUIZ_INVALID_STATE(HttpStatus.BAD_REQUEST, "QUIZ407", "퀴즈 상태가 유효하지 않습니다."),
	QUIZ_NICKNAME_CANNOT_CHANGE(HttpStatus.BAD_REQUEST, "QUIZ_408", "닉네임은 변경할 수 없습니다."),
	QUIZ_CANNOT_JOIN(HttpStatus.BAD_REQUEST, "QUIZ409", "해당 퀴즈는 이미 시작되었거나 종료되었습니다."),
	QUIZ_NICKNAME_TOO_LONG(HttpStatus.BAD_REQUEST, "QUIZ410", "닉네임은 10자 이내로 입력해주세요."),
	QUIZ_NICKNAME_NOT_BLANK(HttpStatus.BAD_REQUEST, "QUIZ411", "닉네임은 공백을 포함할 수 없습니다."),
	QUIZ_NICKNAME_DUPLICATE(HttpStatus.BAD_REQUEST, "QUIZ412", "다른 이용자가 사용 중인 닉네임입니다."),
	// QuizSource 에러 (QUIZ_SOURCE)
	QUIZ_SOURCE_EXISTS(HttpStatus.BAD_REQUEST, "QUIZ_SOURCE400", "이미 저장된 데이터입니다."),
	QUIZ_SOURCE_NOT_FOUND(HttpStatus.BAD_REQUEST, "QUIZ_SOURCE401", "해당 데이터가 없습니다."),
	// History 에러 (HISTORY)

	// Collection 에러 (COLLECTION)
	COLLECTION_NOT_FOUND(HttpStatus.BAD_REQUEST, "COLLECTION400", "해당 컬렉션이 없습니다."),
	COLLECTION_DUPLICATE_NAME(HttpStatus.BAD_REQUEST, "COLLECTION401", "이미 같은 이름의 컬렉션이 존재합니다."),
	COLLECTION_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "COLLECTION402", "해당 컬렉션을 수정할 권한이 없습니다."),
	COLLECTION_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "COLLECTION403", "해당 컬렉션을 삭제할 권한이 없습니다."),
	COLLECTION_INVALID_USER(HttpStatus.BAD_REQUEST, "COLLECTION404", "유효하지 않은 사용자입니다."),
	MISSING_REQUIRED_PARAMETERS(HttpStatus.BAD_REQUEST, "COLLECTION405", "quizId 또는 sourceId 중 하나는 필수입니다."),
	QUIZ_NOT_FOUND(HttpStatus.NOT_FOUND, "COLLECTION406", "해당 퀴즈가 존재하지 않습니다."),
	COLLECTION_TOO_MANY_SOURCE_ID(HttpStatus.BAD_REQUEST, "COLLECTION407", "유효하지 않은 요청입니다."),
	COLLECTION_INVALID_SOURCE_ID(HttpStatus.BAD_REQUEST, "COLLECTION408", "유효하지 않은 요청입니다."),
	COLLECTION_DUPLICATE_SOURCE(HttpStatus.BAD_REQUEST, "COLLECTION409", "컬렉션에 이미 동일한 메모지가 존재합니다."),
	COLLECTION_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "COLLECTION408", "이미 존재하는 컬렉션입니다."),
	// Redis 에러 (REDIS)
	QUIZ_COUNT_NOT_ENOUGH(HttpStatus.BAD_REQUEST, "REDIS500", "요청한 수보다 퀴즈 개수가 적습니다"),
	REDIS_SAVE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "REDIS501", "퀴즈 세션을 저장하는 중 오류가 발생했습니다."),
	REDIS_UPDATE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "REDIS502", "퀴즈 상태를 갱신하는 중 오류가 발생했습니다."),
	REDIS_SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "REDIS503", "퀴즈 세션이 존재하지 않습니다."),
	REDIS_QUIZ_ALREADY_ATTEMPTED(HttpStatus.BAD_REQUEST, "REDIS504", "이미 푼 문제에 대해서 재요청 시 처리할 수 없습니다."),
	REDIS_INVALID_METADATA(HttpStatus.BAD_REQUEST, "REDIS505", "퀴즈 정보가 유효하지 않습니다."),
	REDIS_QUIZ_NOT_FOUND(HttpStatus.NOT_FOUND, "REDIS506", "해당 퀴즈가 존재하지 않습니다."),
	REDIS_PARTICIPANT_NOT_FOUND(HttpStatus.NOT_FOUND, "REDIS507", "해당 참가자가 존재하지 않습니다.");

	private final HttpStatus httpStatusCode;
	private final String errorCode;
	private final String errorMsg;

}
