package site.memozy.memozy_api.global.security;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
public class ActuatorSecurityConfig {

	@Value("${actuator.username}")
	private String actuatorUsername;

	@Value("${actuator.password}")
	private String actuatorPassword;

	@Bean
	@Order(1)
	public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {

		RequestMatcher prometheusMatchers = new OrRequestMatcher(
			new AntPathRequestMatcher("/api/health")
		);

		http
			.securityMatcher(prometheusMatchers)
			.authorizeHttpRequests(auth -> auth
				.anyRequest().hasRole("ACTUATOR"))
			.httpBasic(withDefaults())
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	@Bean
	public UserDetailsService actuatorUserDetailsService() {
		UserDetails user = User.builder()
			.username(actuatorUsername)
			.password(actuatorPassword)
			.roles("ACTUATOR")
			.build();

		return new InMemoryUserDetailsManager(user);
	}
}
