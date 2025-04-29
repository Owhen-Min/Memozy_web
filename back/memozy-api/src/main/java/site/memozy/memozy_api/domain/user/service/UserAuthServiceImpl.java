package site.memozy.memozy_api.domain.user.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.user.User;
import site.memozy.memozy_api.domain.user.repository.UserRepository;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;
import site.memozy.memozy_api.global.auth.GoogleResponse;
import site.memozy.memozy_api.global.auth.OAuth2Response;
import site.memozy.memozy_api.global.auth.UserOAuthDto;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserAuthServiceImpl extends DefaultOAuth2UserService {

	private final UserRepository userRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		OAuth2Response oAuth2Response = getOAuth2Response(oAuth2User);
		
		UserOAuthDto userDto = UserOAuthDto.createUserDto(oAuth2Response);

		User findUser = userRepository.findByEmail(oAuth2Response.getEmail())
			.orElseGet(() -> userRepository.save(UserOAuthDto.toEntity(userDto)));

		userDto.setRole("ROLE_USER");
		userDto.setUserId(findUser.getUserId());

		return new CustomOAuth2User(userDto);
	}

	private OAuth2Response getOAuth2Response(OAuth2User oAuth2User) {
		log.info("Google Register ProviderID: {}", oAuth2User.getAttributes().get("sub"));
		return new GoogleResponse(oAuth2User.getAttributes());
	}
}
