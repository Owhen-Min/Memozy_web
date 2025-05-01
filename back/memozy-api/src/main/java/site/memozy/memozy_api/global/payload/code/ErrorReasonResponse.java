package site.memozy.memozy_api.global.payload.code;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorReasonResponse {

	private HttpStatus httpStatus;

	private final String code;
	private final String message;
}
