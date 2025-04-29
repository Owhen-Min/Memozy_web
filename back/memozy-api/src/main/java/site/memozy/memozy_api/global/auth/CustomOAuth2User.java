package site.memozy.memozy_api.global.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import lombok.RequiredArgsConstructor;
import lombok.ToString;

@ToString
@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {
	private final UserOAuthDto userOAuthDto;

	@Override
	public Map<String, Object> getAttributes() {
		return Map.of();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collection = new ArrayList<>();
		collection.add((GrantedAuthority)userOAuthDto::getRole);

		return collection;
	}

	@Override
	public String getName() {
		return userOAuthDto.getName();
	}

	public Integer getUserId() {
		return userOAuthDto.getUserId();
	}

	public String getRole() {
		return userOAuthDto.getRole();
	}

	public String getEmail() {
		return userOAuthDto.getEmail();
	}

	public String getPersonalId() {
		return userOAuthDto.getPersonalId();
	}
}
