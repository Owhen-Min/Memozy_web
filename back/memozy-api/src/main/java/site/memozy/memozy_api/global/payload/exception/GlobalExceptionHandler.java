package site.memozy.memozy_api.global.payload.exception;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.Optional;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.payload.code.BaseErrorCode;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ConstraintViolationException.class)
	public ApiResponse<Object> handleConstraintViolation(ConstraintViolationException e) {
		String message = e.getConstraintViolations().stream()
			.map(ConstraintViolation::getMessage)
			.findFirst()
			.orElse("유효성 검증 실패");

		logError(e, VALIDATION_ERROR_NULL.getHttpStatusCode(), VALIDATION_ERROR_NULL.getErrorCode(), message);
		return errorResponse(VALIDATION_ERROR_NULL.getErrorCode(), message);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ApiResponse<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		Class<?> requiredType = ex.getRequiredType();

		String typeName = (requiredType != null)
			? requiredType.getSimpleName()
			: "요청한 타입";

		String detailMessage = String.format(
			"파라미터 '%s'의 값 '%s'을(를) %s 타입으로 변환할 수 없습니다.",
			ex.getName(), ex.getValue(), typeName
		);

		logError(ex,
			VALIDATION_ERROR.getHttpStatusCode(),
			VALIDATION_ERROR.getErrorCode(),
			detailMessage
		);

		String userMessage = "입력한 값이 허용 범위를 초과했습니다.";
		return errorResponse(VALIDATION_ERROR.getErrorCode(), userMessage);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ApiResponse<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
			.map(fieldError -> Optional.ofNullable(fieldError.getDefaultMessage()).orElse("잘못된 값입니다"))
			.findFirst()
			.orElse("요청 필드 유효성 검증 실패");

		logError(ex, VALIDATION_ERROR_NULL.getHttpStatusCode(), VALIDATION_ERROR_NULL.getErrorCode(), message);
		return errorResponse(VALIDATION_ERROR_NULL.getErrorCode(), message);
	}

	@ExceptionHandler(GeneralException.class)
	public ApiResponse<Object> handleGeneralException(GeneralException ex) {
		BaseErrorCode error = ex.getCode();

		logError(ex, error.getHttpStatusCode(), error.getErrorCode(), error.getErrorMsg());
		return errorResponse(error.getErrorCode(), error.getErrorMsg());
	}

	@ExceptionHandler(Exception.class)
	public ApiResponse<Object> handleGlobalException(Exception ex) {
		logError(ex, INTERNAL_SERVER_ERROR.getHttpStatusCode(), INTERNAL_SERVER_ERROR.getErrorCode(), ex.getMessage());
		return errorResponse(INTERNAL_SERVER_ERROR.getErrorCode(), "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
	}

	private void logError(Throwable t, Object status, String code, Object message) {
		StackTraceElement origin = t.getStackTrace()[0];
		log.error(
			"Exception in {}.{}({}:{}): Status={}, Code={}, Message={}",
			origin.getClassName(),
			origin.getMethodName(),
			origin.getFileName(),
			origin.getLineNumber(),
			status, code, message
		);
	}

	private ApiResponse<Object> errorResponse(String code, String message) {
		return ApiResponse.error(code, message);
	}
}
