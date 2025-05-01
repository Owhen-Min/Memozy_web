package site.memozy.memozy_api.global.payload.exception;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.INTERNAL_SERVER_ERROR;
import static site.memozy.memozy_api.global.payload.code.ErrorStatus.VALIDATION_ERROR;

import java.util.Optional;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.payload.code.ErrorReasonResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ConstraintViolationException.class)
	public ApiResponse<Object> handleConstraintViolation(ConstraintViolationException e) {
		String message = e.getConstraintViolations().stream()
			.map(ConstraintViolation::getMessage)
			.findFirst()
			.orElse("유효성 검증 실패");

		logError(VALIDATION_ERROR.getHttpStatusCode(), VALIDATION_ERROR.getErrorCode(), message);
		return errorResponse(VALIDATION_ERROR.getErrorCode(), message);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ApiResponse<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getFieldErrors().stream()
			.map(fieldError -> Optional.ofNullable(fieldError.getDefaultMessage()).orElse("잘못된 값입니다"))
			.findFirst()
			.orElse("요청 필드 유효성 검증 실패");

		logError(VALIDATION_ERROR.getHttpStatusCode(), VALIDATION_ERROR.getErrorCode(), message);
		return errorResponse(VALIDATION_ERROR.getErrorCode(), message);
	}

	@ExceptionHandler(GeneralException.class)
	public ApiResponse<Object> handleGeneralException(GeneralException exception) {
		ErrorReasonResponse errorReason = exception.getErrorReason();
		logError(errorReason.getHttpStatus(), errorReason.getCode(), errorReason.getMessage());
		return errorResponse(errorReason.getCode(), errorReason.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public ApiResponse<Object> handleGlobalException(Exception ex) {
		logError(INTERNAL_SERVER_ERROR.getHttpStatusCode(), INTERNAL_SERVER_ERROR.getErrorCode(), ex.getMessage());
		return errorResponse(INTERNAL_SERVER_ERROR.getErrorCode(), INTERNAL_SERVER_ERROR.getErrorMsg());
	}

	private void logError(Object status, String code, Object message) {
		log.error("Error occurred - Status: {}, Code: {}, Message: {}", status, code, message);
	}

	private ApiResponse<Object> errorResponse(String code, String message) {
		return ApiResponse.error(code, message);
	}
}
