package site.memozy.memozy_api.global.websocket.handler;

import java.util.Map;
import java.util.UUID;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;
import site.memozy.memozy_api.global.security.jwt.JwtUtil;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

	private final JwtUtil jwtUtil;
	private final MultiQuizShowRedisRepository redisRepository;
	private static final String BEARER = "Bearer ";

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
		log.debug("[StompHandler] preSend() called with command: {}", accessor.getCommand());

		if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
			log.info("[StompHandler] disconnect command");
			Map<String, Object> attrs = accessor.getSessionAttributes();
			if (attrs == null) {
				return message;
			}

			Object rawUserId = attrs.get("userId");
			Object rawShowId = attrs.get("showId");

			if (!(rawUserId instanceof String) || !(rawShowId instanceof String)) {
				return message;
			}

			String userId = (String)rawUserId;
			String showId = (String)rawShowId;

			redisRepository.disconnectParticipant(showId, userId);

			return message;
		}

		if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
			log.info("STOMP 연결 요청이 아님: {}", accessor.getSessionId());
			return message;
		}

		String token = accessor.getFirstNativeHeader("Authorization");
		String showId = accessor.getFirstNativeHeader("showId");

		String userId = generateRandomCode(6);
		String nickname = "guest" + generateRandomCode(3);
		boolean isMember = false;

		log.info("[StompHandler] showId: {}, token = {}", showId, token);

		if (token != null && token.startsWith(BEARER)) {
			token = token.substring(BEARER.length());
			if (Boolean.FALSE.equals(jwtUtil.isExpired(token))) {
				userId = String.valueOf(jwtUtil.getUserId(token));
				nickname = jwtUtil.getName(token);
				isMember = true;
			}
		} else if (token != null) {
			Map<String, String> userInfo = getParticipantInfo(showId, token);
			if (userInfo != null && !userInfo.isEmpty()) {
				userId = userInfo.getOrDefault("userId", token);
				nickname = userInfo.getOrDefault("nickname", nickname);
				isMember = false;
			}
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

	private String generateRandomCode(int length) {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		return uuid.substring(0, length);
	}

	private Map<String, String> getParticipantInfo(String showId, String userId) {
		Map<String, String> participantInfo = redisRepository.getParticipantInfo(showId, userId);
		if (participantInfo == null) {
			return Map.of();
		}
		return participantInfo;
	}
}
