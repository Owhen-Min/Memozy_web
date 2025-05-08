package site.memozy.memozy_api.domain.quiz.service;

import java.time.Duration;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowEvent;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiQuizShowServiceImpl implements MultiQuizShowService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final CollectionRepository collectionRepository;
	private final ApplicationEventPublisher applicationEventPublisher;

	private static final Duration SHOW_DURATION = Duration.ofDays(1);

	@Override
	public void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember) {

		if (!collectionRepository.existsByCode(showId)) {
			throw new IllegalArgumentException("Invalid code" + showId);
		}

		String participantKey = "show:" + showId + ":participants";
		String userKey = "show:" + showId + ":user:" + userId;

		redisTemplate.opsForSet().add(participantKey, userId);
		redisTemplate.expire(participantKey, SHOW_DURATION); // 1 day

		Map<String, String> joinUser = Map.of(
			"nickname", nickname,
			"userId", userId,
			"member", String.valueOf(isMember)
		);
		redisTemplate.opsForHash().putAll(userKey, joinUser);
		redisTemplate.expire(userKey, SHOW_DURATION); // 1 day

		applicationEventPublisher.publishEvent(new QuizShowEvent(showId, userId, nickname));

	}
}
