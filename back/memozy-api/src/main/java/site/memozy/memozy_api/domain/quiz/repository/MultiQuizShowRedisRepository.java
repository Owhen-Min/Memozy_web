package site.memozy.memozy_api.domain.quiz.repository;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizResponse;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Component
@RequiredArgsConstructor
public class MultiQuizShowRedisRepository {

	private final RedisTemplate<String, Object> redisTemplate;
	private static final String SHOW_KEY = "show:";
	private static final Duration DURATION = Duration.ofDays(1);

	public void saveParticipant(String showId, String userId) {
		log.info("[Redis] saveParticipant() called with showId: {}, userId: {}", showId, userId);
		String participantKey = SHOW_KEY + showId + ":participants";
		try {
			redisTemplate.opsForSet().add(participantKey, userId);
			redisTemplate.expire(participantKey, DURATION);
		} catch (Exception e) {
			log.error("[Redis] Error saving participant: {}", e.getMessage());
			throw new GeneralException(REDIS_SAVE_ERROR);
		}
	}

	public void saveParticipantInfo(String showId, String userId, Map<String, String> info) {
		log.info("[Redis] saveParticipantInfo() called with showId: {}, userId: {}", showId, userId);
		String participantInfoKey = "show:" + showId + ":user:" + userId;
		try {
			redisTemplate.opsForHash().putAll(participantInfoKey, info);
			redisTemplate.expire(participantInfoKey, DURATION);
		} catch (Exception e) {
			log.error("[Redis] Error saving participantInfo: {}", e.getMessage());
			throw new GeneralException(REDIS_SAVE_ERROR);
		}
	}

	public void saveQuizzes(Integer hostId, String showId, Integer collectionId, String collectionName, String hostName,
		int count,
		List<MultiQuizResponse> quizList) {
		log.info("[Redis] saveQuizzes() called with showId: {}, collectionId: {}, hostUserId: {}, count: {}",
			showId, collectionName, hostName, count);
		try {
			String metaDataKey = "show:" + showId + ":metadata";
			Map<String, String> metadata = new HashMap<>();
			metadata.put("hostId", String.valueOf(hostId));
			metadata.put("hostName", String.valueOf(hostName));
			metadata.put("collectionId", String.valueOf(collectionId));
			metadata.put("collectionName", String.valueOf(collectionName));
			metadata.put("quizCount", String.valueOf(count));
			metadata.put("status", "WAITING");
			metadata.put("startTime", LocalDateTime.now().toString());

			redisTemplate.opsForHash().putAll(metaDataKey, metadata);
			redisTemplate.expire(metaDataKey, DURATION);

			String quizListKey = "show:" + showId + ":quiz";
			for (int i = 0; i < quizList.size(); i++) {
				MultiQuizResponse quiz = quizList.get(i);
				String quizId = String.valueOf(quiz.getQuizId());
				redisTemplate.opsForHash().put(quizListKey, String.valueOf(i), quizId);

				String quizKey = "quiz:" + quizId;
				Map<String, String> quizData = new HashMap<>();
				quizData.put("quizIndex", quizId);
				quizData.put("type", String.valueOf(quiz.getType()));
				quizData.put("content", quiz.getContent());
				quizData.put("choice", quiz.getChoice().toString());
				quizData.put("answer", quiz.getAnswer());
				quizData.put("commentary", quiz.getCommentary());

				redisTemplate.opsForHash().putAll(quizKey, quizData);
				redisTemplate.expire(quizKey, DURATION);
			}
			redisTemplate.expire(quizListKey, DURATION);

		} catch (Exception e) {
			log.error("Error saving quizzes to Redis: {}", e.getMessage());
			throw new GeneralException(REDIS_SAVE_ERROR);
		}
	}

	public void saveParticipantAnswer(String showId, String userId, int index, String answer, boolean isCorrect) {
		log.info(
			"[Redis] saveParticipantAnswer() called with showId: {}, userId: {}, index: {}, answer: {}, isCorrect: {}",
			showId, userId, index, answer, isCorrect);
		String answerKey = "show:" + showId + ":userChoice:" + userId;
		try {
			Boolean exists = redisTemplate.opsForHash().hasKey(answerKey, String.valueOf(index));
			if (Boolean.TRUE.equals(exists)) {
				return;
			}
			redisTemplate.opsForHash().put(answerKey, String.valueOf(index), String.valueOf(answer));
			redisTemplate.opsForHash().put(answerKey, String.valueOf(index) + "_choice", String.valueOf(isCorrect));
			redisTemplate.expire(answerKey, Duration.ofDays(1));
		} catch (Exception e) {
			log.info("[Redis] Error saving participantAnswer: {}", e.getMessage());
			throw new GeneralException(REDIS_SAVE_ERROR);
		}
	}

	public String updateParticipantNickname(String showId, String userId, String newNickname) {
		log.info("[Redis] updateParticipantNickname() called with showId: {}, userId: {}, newNickname: {}", showId,
			userId, newNickname);
		String participantInfoKey = "show:" + showId + ":user:" + userId;

		try {
			redisTemplate.opsForHash().put(participantInfoKey, "nickname", newNickname);
			redisTemplate.expire(participantInfoKey, Duration.ofDays(1));
			return redisTemplate.opsForHash().get(participantInfoKey, "nickname").toString();
		} catch (Exception e) {
			log.error("[Redis] Error updating participant nickname: {}", e.getMessage());
			throw new GeneralException(REDIS_SAVE_ERROR);
		}
	}

	public Set<Object> findParticipants(String showId) {
		log.info("[Redis] saveMembers() called with showId: {}", showId);
		String participantKey = "show:" + showId + ":participants";
		try {
			return redisTemplate.opsForSet().members(participantKey);
		} catch (Exception e) {
			log.error("[Redis] Error finding participants : {}", e.getMessage());
			throw new GeneralException(REDIS_PARTICIPANT_NOT_FOUND);
		}
	}

	public Map<String, String> getQuizMetaData(String showId) {
		log.info("[Redis] getQuizMetaData() called with showId: {}", showId);
		String metaKey = "show:" + showId + ":metadata";
		try {
			Map<Object, Object> metadata = redisTemplate.opsForHash().entries(metaKey);

			if (metadata.isEmpty()) {
				throw new GeneralException(REDIS_INVALID_METADATA);
			}

			Map<String, String> quizData = new HashMap<>();
			for (Map.Entry<Object, Object> entry : metadata.entrySet()) {
				quizData.put(entry.getKey().toString(), entry.getValue().toString());
			}

			log.info("[Redis] Quiz metadata: {}", quizData);
			return quizData;
		} catch (Exception e) {
			log.error("[Redis] Error getting quiz metadata: {}", e.getMessage());
			throw new GeneralException(REDIS_SESSION_NOT_FOUND);
		}
	}

	public Map<String, Object> getQuizByIndex(String showId, int index) {
		log.info("[Redis] getQuizByIndex() called with showId: {}", showId);
		String quizKey = "show:" + showId + ":quiz";
		try {
			Object quizIdObj = redisTemplate.opsForHash().get(quizKey, String.valueOf(index));
			log.info("[redis] getQuizByIndex() quizId = {}", quizIdObj);

			String quizId = String.valueOf(quizIdObj);
			String quizByIndexKey = "quiz:" + quizId;

			Map<Object, Object> quizData = redisTemplate.opsForHash().entries(quizByIndexKey);
			if (quizData.isEmpty()) {
				throw new GeneralException(REDIS_QUIZ_NOT_FOUND);
			}

			return Map.of(
				"quizId", quizId,
				"type", quizData.getOrDefault("type", ""),
				"content", quizData.getOrDefault("content", ""),
				"choice", quizData.getOrDefault("choice", ""),
				"answer", quizData.getOrDefault("answer", ""),
				"commentary", quizData.getOrDefault("commentary", "")
			);

		} catch (Exception e) {
			log.error("[Redis] Error getting quiz by index: {}", e.getMessage());
			throw new GeneralException(REDIS_QUIZ_NOT_FOUND);
		}
	}

	public int getQuizCount(String showId) {
		log.info("[Redis] getQuizCount() called with showId: {}", showId);
		String metaKey = "show:" + showId + ":metadata";
		try {
			String countStr = (String)redisTemplate.opsForHash().get(metaKey, "quizCount");
			return countStr != null ? Integer.parseInt(countStr) : 0;
		} catch (Exception e) {
			log.error("[Redis] Error getting quiz count: {}", e.getMessage());
			throw new GeneralException(REDIS_SESSION_NOT_FOUND);
		}
	}

	public Map<String, Map<String, Object>> getUserChoice(String showId, String userId) {
		log.info("[Redis] getUserChoice() called with showId: {}, userId: {}", showId, userId);
		String answerKey = "show:" + showId + ":userChoice:" + userId;
		try {
			Map<Object, Object> allEntries = redisTemplate.opsForHash().entries(answerKey);
			Map<String, Map<String, Object>> result = new HashMap<>();
			for (Map.Entry<Object, Object> entry : allEntries.entrySet()) {
				String key = entry.getKey().toString();
				String value = entry.getValue().toString();
				if (key.endsWith("_choice")) {
					String index = key.replace("_choice", "");
					result.computeIfAbsent(index, k -> new HashMap<>())
						.put("isCorrect", Boolean.parseBoolean(value));
				} else {
					result.computeIfAbsent(key, k -> new HashMap<>())
						.put("userAnswer", value);
				}
			}
			return result;
		} catch (Exception e) {
			log.error("[Redis] Error getting user choice: {}", e.getMessage());
			throw new GeneralException(REDIS_SESSION_NOT_FOUND);
		}
	}

	public Map<String, String> getParticipantInfo(String showId, String userId) {
		log.info("[Redis] getParticipantInfo() called with showId: {}, userId: {}", showId, userId);
		String participantInfoKey = "show:" + showId + ":user:" + userId;
		try {
			Map<Object, Object> raw = redisTemplate.opsForHash().entries(participantInfoKey);
			Map<String, String> result = new HashMap<>();
			for (Map.Entry<Object, Object> entry : raw.entrySet()) {
				result.put(entry.getKey().toString(), entry.getValue().toString());
			}
			return result;
		} catch (Exception e) {
			log.error("[Redis] Error getting participant info: {}", e.getMessage());
			throw new GeneralException(REDIS_SESSION_NOT_FOUND);
		}
	}
}
