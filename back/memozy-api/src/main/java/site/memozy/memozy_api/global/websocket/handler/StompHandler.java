package site.memozy.memozy_api.global.websocket.handler;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.global.security.jwt.JwtUtil;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

	private final JwtUtil jwtUtil;

	private static final String BEARER = "Bearer ";

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		log.debug("[StompHandler] preSend() called with command: {}", accessor.getCommand());

		if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
			log.info("STOMP 정상 종료 요청: {}", accessor.getSessionId());
			return message;
		}

		if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
			return message;
		}

		String userId = generateRandomCode();
		String nickname = "Guest" + ThreadLocalRandom.current().nextInt(100, 1000);
		boolean isMember = false;

		String token = Optional.ofNullable(accessor.getFirstNativeHeader("Authorization"))
			.filter(t -> t.startsWith(BEARER))
			.map(t -> t.substring(BEARER.length()))
			.filter(t -> !jwtUtil.isExpired(t))
			.orElse(null);

		log.debug("[StompHandler] token: {}", token);

		if (token != null) {
			userId = String.valueOf(jwtUtil.getUserId(token));
			nickname = jwtUtil.getName(token);
			isMember = true;
		}

		accessor.getSessionAttributes().put("userId", userId);
		accessor.getSessionAttributes().put("nickname", nickname);
		accessor.getSessionAttributes().put("isMember", isMember);

		log.info("[StompHandler] WebSocket 연결: userId={}, nickname={}, isMember={}", userId, nickname, isMember);

		return MessageBuilder
			.withPayload(message.getPayload())
			.copyHeaders(accessor.getMessageHeaders())
			.build();
	}

	private String generateRandomCode() {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		return uuid.substring(0, 8);
	}
}

