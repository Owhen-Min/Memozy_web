package site.memozy.memozy_api.domain.collection.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import site.memozy.memozy_api.global.response.ApiResponse;

@RestControllerAdvice
@Order(2)
public class CollectionExceptionHandler {
	private static final Logger logger = LoggerFactory.getLogger(CollectionExceptionHandler.class);

	@ExceptionHandler(CollectionException.class)
	public ApiResponse<Object> handleUserException(CollectionException exception) {
		CollectionError error = exception.getError();

		String clientMsg = error.getHttpStatusCode().startsWith("4")
			? error.getErrorMsg()
			: "일시적인 서버 오류가 발생했습니다";

		return ApiResponse.error(error.getErrorCode(), clientMsg);
	}
}
