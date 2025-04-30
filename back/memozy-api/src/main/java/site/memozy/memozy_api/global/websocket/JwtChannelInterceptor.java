package site.memozy.memozy_api.global.websocket;

import java.util.Optional;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.global.jwt.JwtUtil;

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

	private final JwtUtil jwtUtil;

	private static final String BEARER = "Bearer ";

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
			return message;
		}

		String token = Optional.ofNullable(accessor.getFirstNativeHeader("Authorization"))
			.filter(t -> t.startsWith(BEARER))
			.map(t -> t.substring(BEARER.length()))
			.filter(t -> !jwtUtil.isExpired(t))
			.orElse(null);

		if (token != null) {
			Integer userId = jwtUtil.getUserId(token);
			String userName = jwtUtil.getName(token);
			accessor.getSessionAttributes().put("userId", userId);

		}
	}
}
