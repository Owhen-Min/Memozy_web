package site.memozy.memozy_api.global.jwt;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;
import site.memozy.memozy_api.global.auth.UserOAuthDto;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final AntPathMatcher pathMatcher = new AntPathMatcher();

	private static final List<String> NO_CHECK_URLS = Arrays.asList(
		"/ws", "/ws/", "/wss", "/wss/", "/ws-connect", "/ws-connect/"
	);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		String path = request.getRequestURI();

		if (NO_CHECK_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path))) {
			filterChain.doFilter(request, response);
			return;
		}

		String authorizationHeader = request.getHeader("Authorization");
		log.info("Authorization Header: {}", authorizationHeader);

		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		try {

			String token = authorizationHeader.substring(7);

			boolean isExpired = jwtUtil.isExpired(token);
			if (isExpired) {
				log.error("Token expired");
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.sendRedirect("http://localhost:8080/");
				return;
			}

			String personalId = jwtUtil.getPersonalId(token);
			String role = jwtUtil.getRole(token);
			Integer userId = jwtUtil.getUserId(token);
			String name = jwtUtil.getName(token);

			UserOAuthDto userDto = new UserOAuthDto(userId, personalId, role, name);
			CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDto);

			Authentication authToken = new UsernamePasswordAuthenticationToken(
				customOAuth2User, null, customOAuth2User.getAuthorities()
			);

			SecurityContextHolder.getContext().setAuthentication(authToken);

		} catch (Exception e) {
			log.error("JWT 필터 처리 중 에러 발생", e);
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		filterChain.doFilter(request, response);
	}

}

