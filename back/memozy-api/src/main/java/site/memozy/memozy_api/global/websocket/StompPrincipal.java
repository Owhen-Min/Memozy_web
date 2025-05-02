package site.memozy.memozy_api.global.websocket;

import java.security.Principal;

import lombok.Getter;

@Getter
public class StompPrincipal implements Principal {

	private final String userId;
	private String nickname;
	private final boolean isMember;

	public StompPrincipal(String userId, String nickname, boolean isMember) {
		this.userId = userId;
		this.nickname = nickname;
		this.isMember = isMember;
	}

	@Override
	public String getName() {
		return userId;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
}
