package site.memozy.memozy_api.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.global.audit.BaseTimeEntity;
import site.memozy.memozy_api.global.auth.UserOAuthDto;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;

	@Column(name = "personal_id", length = 100)
	private String personalId;

	@Column(nullable = false, length = 100, unique = true)
	private String email;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String profileImage;

	public static User createUser(UserOAuthDto userOAuthDto) {
		User user = new User();
		user.email = userOAuthDto.getEmail();
		user.profileImage = userOAuthDto.getProfileImage();
		user.name = userOAuthDto.getName();
		user.personalId = userOAuthDto.getPersonalId();

		return user;

	}
}
