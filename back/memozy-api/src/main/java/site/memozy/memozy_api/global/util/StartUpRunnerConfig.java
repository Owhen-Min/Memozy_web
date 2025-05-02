package site.memozy.memozy_api.global.util;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import lombok.RequiredArgsConstructor;

@Configuration
@Profile("local")
@RequiredArgsConstructor
public class StartUpRunnerConfig {

	private final UserUtil userUtil;

	@Bean
	public ApplicationRunner initializeDefaultUser() {
		return args -> userUtil.addDefaultUsers();
	}
}
