package site.memozy.memozy_api.global.security.jwt;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.SecurityResponseUtil;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {
		String message = "로그인이 필요합니다. 먼저 로그인해주세요.";
		if (authException instanceof BadCredentialsException) {
			message = authException.getMessage();
		}

		ApiResponse apiResponse = ApiResponse.error("500", message);
		SecurityResponseUtil.writeJsonResponse(response, apiResponse);

	}
}
