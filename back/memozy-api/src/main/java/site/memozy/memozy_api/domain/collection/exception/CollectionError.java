package site.memozy.memozy_api.domain.collection.exception;

import lombok.Getter;

@Getter
public enum CollectionError {
	USER_NOT_FOUND("400", "3001", "가입되지 않은 사용자입니다.");

	private final String httpStatusCode;
	private final String errorCode;
	private final String errorMsg;

	CollectionError(String httpStatusCode, String errorCode, String errorMsg) {
		this.httpStatusCode = httpStatusCode;
		this.errorCode = errorCode;
		this.errorMsg = errorMsg;
	}
}
