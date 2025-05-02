package site.memozy.memozy_api.global.payload.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import site.memozy.memozy_api.global.payload.code.BaseErrorCode;

@Getter
@AllArgsConstructor
public class GeneralException extends RuntimeException {

	private final transient BaseErrorCode code;

}
