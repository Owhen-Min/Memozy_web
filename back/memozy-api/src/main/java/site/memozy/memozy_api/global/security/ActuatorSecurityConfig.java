package site.memozy.memozy_api.global.security;

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

@Configuration
public class ActuatorSecurityConfig {

	@Value("${actuator.username}")
	private String actuatorUsername;

	@Value("${actuator.password}")
	private String actuatorPassword;

	@Bean
	@Order(1)
	public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
		http
			.securityMatcher("/api/prometheus")
			.authorizeHttpRequests(auth -> auth
				.anyRequest().hasRole("ACTUATOR"))
			.httpBasic(httpBasic -> {
			})
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
