package site.memozy.memozy_api.global.security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import site.memozy.memozy_api.global.payload.ApiResponse;

@Component
public class CustomDeniedHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
		AccessDeniedException accessDeniedException) throws IOException {
		ApiResponse apiResponse = ApiResponse.error("500", "요청하신 리소스에 접근할 권한이 없습니다.");
		SecurityResponseUtil.writeJsonResponse(response, apiResponse);

	}
}
