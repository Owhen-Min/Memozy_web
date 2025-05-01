package site.memozy.memozy_api.global.payload.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import site.memozy.memozy_api.global.payload.code.BaseErrorCode;
import site.memozy.memozy_api.global.payload.code.ErrorReasonResponse;

@Getter
@AllArgsConstructor
public class GeneralException extends RuntimeException {

	private BaseErrorCode code;

	public ErrorReasonResponse getErrorReason() {
		return this.code.getErrorReason();
	}
}
