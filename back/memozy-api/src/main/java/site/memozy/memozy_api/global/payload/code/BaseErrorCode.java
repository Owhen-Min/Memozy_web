package site.memozy.memozy_api.global.payload.code;

import org.springframework.http.HttpStatus;

public interface BaseErrorCode {
	HttpStatus getHttpStatusCode();

	String getErrorCode();

	String getErrorMsg();

	default CustomErrorStatus withMessage(String customMessage) {
		return new CustomErrorStatus(getHttpStatusCode(), getErrorCode(), customMessage);
	}
}
