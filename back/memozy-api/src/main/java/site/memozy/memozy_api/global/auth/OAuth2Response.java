package site.memozy.memozy_api.global.auth;

public interface OAuth2Response {

	String getProviderId();

	String getEmail();

	String getName();

	String getProfileImage();
}
