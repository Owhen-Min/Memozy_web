package site.memozy.memozy_api.global.payload.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorStatus {
	// 가장 일반적인 응답 (COMMON)
	INTERNAL_SERVER_ERROR("500", "COMMON5000", "서버 에러, 관리자에게 문의 바랍니다."),
	BAD_REQUEST("400", "COMMON400", "잘못된 요청입니다."),
	UNAUTHORIZED("401", "COMMON401", "인증이 필요합니다."),
	FORBIDDEN("403", "COMMON403", "금지된 요청입니다."),

	// User 에러 (USER)
	MEMBER_NOT_FOUND("400", "USER401", "사용자가 없습니다."),
	MEMBER_DUPLICATE_EMAIL("400", "USER402", "이미 사용 중인 이메일입니다.");

	// Quiz 에러 (QUIZ)

	// QuizSource 에러 (QUZIS_SOURCE)

	// History 에러 (HISTORY)

	// Collection 에러 (COLLECTION)

	private final String httpStatusCode;
	private final String errorCode;
	private final String errorMsg;

}
