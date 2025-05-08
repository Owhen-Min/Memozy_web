package site.memozy.memozy_api.domain.quiz.repository;

import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MultiQuizShowRedisRepository {

	private final RedisTemplate<String, Object> redisTemplate;

	public Set<Object> findMembers(String showId) {
		return redisTemplate.opsForSet().members("show:" + showId + ":participants");
	}
}
