package site.memozy.memozy_api.global.payload.exception;

import lombok.Getter;
import site.memozy.memozy_api.global.payload.code.BaseErrorCode;

@Getter
public class GeneralException extends RuntimeException {

	private final transient BaseErrorCode code;

	public GeneralException(BaseErrorCode code) {
		super(code.getErrorMsg());
		this.code = code;
	}

	public BaseErrorCode getCode() {
		return code;
	}

}
