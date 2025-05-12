package site.memozy.memozy_api.domain.quiz.repository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MultiQuizShowRedisRepository {

	private final RedisTemplate<String, Object> redisTemplate;

	private static final Duration DURATION = Duration.ofDays(1);

	public void saveParticipant(String showId, String userId) {
		String participantKey = "show:" + showId + ":participants";
		redisTemplate.opsForSet().add(participantKey, userId);
		redisTemplate.expire(participantKey, DURATION);
	}

	public void saveParticipantInfo(String showId, String userId, Map<String, String> info) {
		String participantInfoKey = "show:" + showId + ":user:" + userId;
		redisTemplate.opsForHash().putAll(participantInfoKey, info);
		redisTemplate.expire(participantInfoKey, DURATION);
	}

	public Set<Object> findMembers(String showId) {
		String participantKey = "show:" + showId + ":participants";
		return redisTemplate.opsForSet().members(participantKey);
	}

	public void saveQuizzes(String showId, int collectionId, int hostUserId, int count, List<String> quizList) {
		String metaDataKey = "show:" + showId + ":metadata";
		Map<String, String> metadata = new HashMap<>();
		metadata.put("hostUserId", String.valueOf(hostUserId));
		metadata.put("collectionId", String.valueOf(collectionId));
		metadata.put("quizCount", String.valueOf(count));
		metadata.put("startTime", LocalDateTime.now().toString());

		redisTemplate.opsForHash().putAll(metaDataKey, metadata);
		redisTemplate.expire(metaDataKey, 1, TimeUnit.DAYS);

		String quizListKey = "show:" + showId + ":quiz";
		for (int i = 0; i < quizList.size(); i++) {
			String quizIndex = String.valueOf(i); // 순차 index 기반
			redisTemplate.opsForHash().put(quizListKey, quizIndex, quizList.get(i));
		}
		redisTemplate.expire(quizListKey, 1, TimeUnit.DAYS);
	}

	public String getQuizByIndex(String showId, int index) {
		String quizKey = "show:" + showId + ":quiz";
		return (String)redisTemplate.opsForHash().get(quizKey, String.valueOf(index));
	}

	public int getQuizCount(String showId) {
		String metaKey = "show:" + showId + ":metadata";
		String countStr = (String)redisTemplate.opsForHash().get(metaKey, "quizCount");
		return countStr != null ? Integer.parseInt(countStr) : 0;
	}

	public void saveParticipantAnswer(String showId, String userId, int index, String answer, boolean isCorrect) {
		String answerKey = "show:" + showId + ":userChoice:" + userId;

		Boolean exists = redisTemplate.opsForHash().hasKey(answerKey, String.valueOf(index));
		if (Boolean.TRUE.equals(exists)) {
			return;
		}

		redisTemplate.opsForHash().put(answerKey, String.valueOf(index), String.valueOf(answer));
		redisTemplate.opsForHash().put(answerKey, String.valueOf(index) + "_choice", String.valueOf(isCorrect));
		redisTemplate.expire(answerKey, Duration.ofDays(1));
	}

	public Map<String, String> getUserChoice(String showId, String userId) {
		String answerKey = "show:" + showId + ":userChoice:" + userId;
		Map<Object, Object> allEntries = redisTemplate.opsForHash().entries(answerKey);

		Map<String, String> result = new HashMap<>();
		for (Map.Entry<Object, Object> entry : allEntries.entrySet()) {
			String key = entry.getKey().toString();
			if (key.endsWith("_choice")) {
				result.put(key, entry.getValue().toString());
			}
		}
		return result;
	}

	public Map<String, String> getParticipantInfo(String showId, String userId) {
		String participantInfoKey = "show:" + showId + ":user:" + userId;
		Map<Object, Object> raw = redisTemplate.opsForHash().entries(participantInfoKey);

		Map<String, String> result = new HashMap<>();
		for (Map.Entry<Object, Object> entry : raw.entrySet()) {
			result.put(entry.getKey().toString(), entry.getValue().toString());
		}
		return result;
	}
}
