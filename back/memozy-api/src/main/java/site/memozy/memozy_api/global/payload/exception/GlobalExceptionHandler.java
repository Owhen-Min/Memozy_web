package site.memozy.memozy_api.global.payload.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.payload.ApiResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ApiResponse<Object> handleGlobalException(Exception ex) {
		log.error("Unhandled exception occurred: {}", ex.getMessage(), ex);

		return ApiResponse.error("500", "일시적인 서버 오류가 발생했습니다");
	}
}
