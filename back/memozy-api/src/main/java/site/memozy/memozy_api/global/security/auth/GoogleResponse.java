package site.memozy.memozy_api.global.security.auth;

import java.util.Map;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class GoogleResponse implements OAuth2Response {

	private final Map<String, Object> attributes;

	@Override
	public String getProviderId() {
		return attributes.get("sub").toString();
	}

	@Override
	public String getEmail() {
		return attributes.get("email").toString();
	}

	@Override
	public String getName() {
		return attributes.get("name").toString();
	}

	@Override
	public String getProfileImage() {
		return attributes.get("picture").toString();
	}
}

