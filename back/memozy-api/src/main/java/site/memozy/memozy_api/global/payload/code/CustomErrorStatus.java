package site.memozy.memozy_api.global.payload.code;

import org.springframework.http.HttpStatus;

public record CustomErrorStatus(HttpStatus httpStatusCode, String errorCode, String errorMsg) implements BaseErrorCode {
	@Override
	public HttpStatus getHttpStatusCode() {
		return httpStatusCode;
	}

	@Override
	public String getErrorCode() {
		return errorCode;
	}

	@Override
	public String getErrorMsg() {
		return errorMsg;
	}
}
