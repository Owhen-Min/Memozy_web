package site.memozy.memozy_api.global.security;

import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

	private final OAuth2AuthorizationRequestResolver defaultResolver;

	public CustomAuthorizationRequestResolver(ClientRegistrationRepository repo, String baseUri) {
		this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, baseUri);
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
		OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
		return customizeRequest(request, req);
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
		OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
		return customizeRequest(request, req);
	}

	private OAuth2AuthorizationRequest customizeRequest(HttpServletRequest request, OAuth2AuthorizationRequest req) {
		if (req == null)
			return null;
		String state = request.getParameter("state");
		return OAuth2AuthorizationRequest.from(req)
			.state(state)
			.build();
	}
}
