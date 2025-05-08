package site.memozy.memozy_api.global.security.handler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;
import site.memozy.memozy_api.global.security.jwt.JwtUtil;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {

		CustomOAuth2User userDetails = (CustomOAuth2User)authentication.getPrincipal();
		String token = generateJwtToken(authentication, userDetails);
		String state = request.getParameter("state");

		if (state != null && state.startsWith("mode:extension")) {
			log.info("Extension login success");
			respondToExtension(response, token);
		} else {
			log.info("Web login success");
			respondToWeb(response, token);
		}
	}

	private String generateJwtToken(Authentication authentication, CustomOAuth2User userDetails) {
		String role = authentication.getAuthorities().stream()
			.findFirst()
			.map(GrantedAuthority::getAuthority)
			.orElse("ROLE_GUEST");

		return jwtUtil.createJwt(userDetails, role);
	}

	private void respondToExtension(HttpServletResponse response, String token) throws IOException {
		// String redirectUri = "https://edkigpibifokljeefiomnfadenbfcchj.chromiumapp.org/";
		String redirectUri = "https://dfghbgncpceajjhnkmfinhmdafmkglak.chromiumapp.org/";
		String tokenParam = "access_token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
		String finalRedirectUrl = redirectUri + "#" + tokenParam;
		response.setStatus(HttpServletResponse.SC_FOUND);
		response.setHeader("Location", finalRedirectUrl);
		response.getWriter().write("Redirecting...");
	}

	private void respondToWeb(HttpServletResponse response, String token) throws IOException {
		String redirectUrl = "http://localhost:5173/?token=" + token;
		response.sendRedirect(redirectUrl);
	}
}
