package site.memozy.memozy_api.global.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.user.repository.UserRepository;
import site.memozy.memozy_api.domain.user.service.UserAuthServiceImpl;
import site.memozy.memozy_api.global.security.handler.CustomAuthorizationRequestResolver;
import site.memozy.memozy_api.global.security.handler.CustomDeniedHandler;
import site.memozy.memozy_api.global.security.handler.CustomSuccessHandler;
import site.memozy.memozy_api.global.security.handler.OAuth2AuthenticationFailureHandler;
import site.memozy.memozy_api.global.security.jwt.JwtAuthenticationEntryPoint;
import site.memozy.memozy_api.global.security.jwt.JwtFilter;
import site.memozy.memozy_api.global.security.jwt.JwtUtil;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final CustomSuccessHandler customSuccessHandler;
	private final UserAuthServiceImpl userAuthServiceImpl;
	private final CustomDeniedHandler customDeniedHandler;
	private final JwtUtil jwtUtil;

	private static final List<String> PERMIT_URLS = List.of(
		"/favicon.ico", "/css/**", "/js/**", "/images/**",
		"/oauth2/**", "/login/oauth2/**", "/login",
		"/ws-connect", "/ws-connect/**",
		"/swagger-ui/**", "/v3/api-docs/**",
		"/", "/index.html",
		"/api/prometheus", "/api/health"
	);

	@Bean
	@Order(2)
	public SecurityFilterChain filterChain(HttpSecurity http, UserRepository userRepository,
		ClientRegistrationRepository clientRegistrationRepository) throws Exception {

		OAuth2AuthorizationRequestResolver customResolver =
			new CustomAuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.formLogin(form -> form.disable())
			.httpBasic(basic -> basic.disable())
			.addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
			.oauth2Login(oauth2 -> oauth2
				.authorizationEndpoint(endpoint -> endpoint
					.authorizationRequestResolver(customResolver)
					.baseUri("/oauth2/authorization")
					.authorizationRequestRepository(new HttpSessionOAuth2AuthorizationRequestRepository())
				)
				.userInfoEndpoint(userInfo -> userInfo.userService(userAuthServiceImpl))
				.successHandler(customSuccessHandler)
				.failureHandler(oAuth2AuthenticationFailureHandler)
			)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(PERMIT_URLS.toArray(new String[0])).permitAll()
				.anyRequest().authenticated()
			)
			.sessionManagement(session -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.exceptionHandling(ex -> ex
				.authenticationEntryPoint(jwtAuthenticationEntryPoint)
				.accessDeniedHandler(customDeniedHandler));

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(
			"chrome-extension://mlgeojjbngcoionmkpgncgagfliiddgj",
			"chrome-extension://edkigpibifokljeefiomnfadenbfcchj",
			"chrome-extension://nefohmbgipjojkepcndhnhnbpbldabdi",
			"chrome-extension://ofcakbiecfnkhepdkhkjfnlnokjddhnl",
			"http://localhost:5173",
			"https://localhost:5173",
			"https://memozy.site",
			"https://test.memozy.site"
		));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(Collections.singletonList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}
