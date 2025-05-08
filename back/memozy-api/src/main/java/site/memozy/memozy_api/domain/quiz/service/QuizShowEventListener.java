package site.memozy.memozy_api.domain.quiz.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowEvent;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;

@Component
@RequiredArgsConstructor
public class QuizShowEventListener {

	private final SimpMessagingTemplate messagingTemplate;
	private final RedisTemplate<String, Object> redisTemplate;
	private final MultiQuizShowRedisRepository multiQuizShowRedisRepository;

	@EventListener
	public void handleQuizShowEvent(QuizShowEvent event) {
		String showId = event.showId();
		String nickname = event.nickname();

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId,
			Map.of(
				"type", "JOIN",
				"userId", event.userId(),
				"nickname", nickname
			)
		);

		Set<Object> members = multiQuizShowRedisRepository.findMembers(showId);

		List<String> users = members.stream()
			.map(id -> redisTemplate.opsForHash().entries("show:" + showId + ":user:" + id))
			.filter(Objects::nonNull)
			.map(user -> (String)user.get("nickname"))
			.toList();

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId,
			Map.of(
				"type", "PARTICIPANT_LIST",
				"participants", users
			)
		);
	}
}
