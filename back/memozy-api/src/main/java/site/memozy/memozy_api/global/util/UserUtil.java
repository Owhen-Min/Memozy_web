package site.memozy.memozy_api.global.util;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.user.User;
import site.memozy.memozy_api.domain.user.repository.UserRepository;
import site.memozy.memozy_api.global.security.auth.UserOAuthDto;
import site.memozy.memozy_api.global.security.jwt.JwtUtil;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserUtil {

	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;

	public void addDefaultUsers() {
		UserOAuthDto userOAuthDto = new UserOAuthDto();
		userOAuthDto.setEmail("test@naver.com");
		userOAuthDto.setProfileImage("https://robohash.org/1234?set=set2&size=180x180");
		userOAuthDto.setName("테스트계정");
		userOAuthDto.setPersonalId("1234");
		User user = User.createUser(userOAuthDto);

		User saveUser = userRepository.findByEmail(user.getEmail())
			.orElseGet(() -> userRepository.save(user));

		createTokens(saveUser);
	}

	public void createTokens(User saveUser) {
		String accessToken = jwtUtil.createJwt(saveUser);
		log.info("--------------------------");
		log.info("Access Token : Bearer {}", accessToken);
		log.info("--------------------------");

	}
}
