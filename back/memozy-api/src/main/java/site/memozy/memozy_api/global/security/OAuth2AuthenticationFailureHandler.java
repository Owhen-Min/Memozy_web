package site.memozy.memozy_api.global.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException exception) throws IOException, ServletException {

		String errorCode = "UNKNOWN_ERROR";
		if (exception instanceof OAuth2AuthenticationException) {
			errorCode = ((OAuth2AuthenticationException)exception).getError().getErrorCode();
		}

		String redirectUrl = "localhost:8080";
		log.info("exception {}", exception.toString());
		log.info("errorCode {}", errorCode);

		getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}

}

