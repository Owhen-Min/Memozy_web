package site.memozy.memozy_api.global.security.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import site.memozy.memozy_api.domain.user.User;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserOAuthDto {

	private Integer userId;
	private String personalId;
	private String email;
	private String name;
	private String role;
	private String profileImage;

	public static UserOAuthDto createUserDto(OAuth2Response oAuth2Response) {
		return UserOAuthDto.builder()
			.personalId(oAuth2Response.getProviderId())
			.email(oAuth2Response.getEmail())
			.name(oAuth2Response.getName())
			.role("ROLE_USER")
			.profileImage(oAuth2Response.getProfileImage())
			.build();
	}

	public static User toEntity(UserOAuthDto userDto) {
		return User.createUser(userDto);
	}

}
