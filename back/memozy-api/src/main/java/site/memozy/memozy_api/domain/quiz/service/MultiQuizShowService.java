package site.memozy.memozy_api.domain.quiz.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.quiz.dto.ParticipantDto;
import site.memozy.memozy_api.global.websocket.StompPrincipal;

@Service
@RequiredArgsConstructor
public class MultiQuizShowService {

	private final RedisTemplate redisTemplate;
	private final CollectionRepository collectionRepository;

	public void joinMultiQuizShow(String code, StompPrincipal principal) {
		if (!collectionRepository.existsByCode(code)) {
			throw new IllegalArgumentException("Invalid code");
		}

		String key = "quizId:" + code;
		ParticipantDto participantDto = new ParticipantDto(principal.getName(), principal.getNickname(),
			principal.isMember());

		String participantKey = "show:" + code + ":participant";
		String userKey = "show:" + code + ":user";

		redisTemplate.opsForSet().add(participantKey, principal.getName());
		redisTemplate.expire(participantKey, Duration.ofDays(60 * 60 * 24)); // 1 day

		Map<String, String> userInfo = Map.of(
			"nickname", principal.getNickname(),
			"userId", principal.getName(),
			"member", String.valueOf(principal.isMember())
		);
		redisTemplate.opsForHash().putAll(userKey, userInfo);
		redisTemplate.expire(userKey, Duration.ofDays(60 * 60 * 24)); // 1 day

		// TODO : 참가자 broadcast
	}
}
