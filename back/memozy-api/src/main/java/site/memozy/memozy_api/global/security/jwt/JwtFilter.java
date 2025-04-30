package site.memozy.memozy_api.global.security.jwt;

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
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.SecurityResponseUtil;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;
import site.memozy.memozy_api.global.security.auth.UserOAuthDto;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final AntPathMatcher pathMatcher = new AntPathMatcher();

	private static final List<String> NO_CHECK_URLS = Arrays.asList(
		"/favicon.ico", "/css/**", "/js/**", "/images/**",
		"/oauth2/**", "/login/oauth2/**", "/login",
		"/ws-connect", "/ws-connect/**",
		"/", "/index.html"
	);

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
		return NO_CHECK_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

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
				ApiResponse apiResponse = new ApiResponse(false, "400", "로그인이 필요합니다. 먼저 로그인해주세요", null);
				SecurityResponseUtil.writeJsonResponse(response, apiResponse);
				return;
			}

			String personalId = jwtUtil.getPersonalId(token);
			String role = jwtUtil.getRole(token);
			Integer userId = jwtUtil.getUserId(token);
			String name = jwtUtil.getName(token);
			String email = jwtUtil.getEmail(token);
			String profileImage = jwtUtil.getProfileImage(token);

			UserOAuthDto userDto = new UserOAuthDto(userId, personalId, email, name, role, profileImage);
			CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDto);

			Authentication authToken = new UsernamePasswordAuthenticationToken(
				customOAuth2User, null, customOAuth2User.getAuthorities()
			);

			SecurityContextHolder.getContext().setAuthentication(authToken);

		} catch (Exception e) {
			log.error("Token Error");
			ApiResponse apiResponse = new ApiResponse(false, "400", "필터처리 중 에러 발생", null);
			SecurityResponseUtil.writeJsonResponse(response, apiResponse);
			return;
		}

		filterChain.doFilter(request, response);
	}

}

