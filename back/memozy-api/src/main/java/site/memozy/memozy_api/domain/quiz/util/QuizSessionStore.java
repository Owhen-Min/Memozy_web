package site.memozy.memozy_api.domain.quiz.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class QuizSessionStore {
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	// Quiz 세션 저장
	public String saveQuizSession(int userId, List<String> quizList, String sessionId, int collectionId) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			// quizList 저장
			redisTemplate.opsForHash().put(redisKey, "quizList", objectMapper.writeValueAsString(quizList));

			// quizStatus 초기화 후 저장
			Map<String, Map<String, String>> quizStatus = new HashMap<>();
			for (String quizId : quizList) {
				Map<String, String> status = new HashMap<>();
				status.put("correct", "null");
				status.put("attempted", "false");
				status.put("answer", "");
				quizStatus.put(quizId, status);
			}
			redisTemplate.opsForHash().put(redisKey, "quizStatus", objectMapper.writeValueAsString(quizStatus));

			// quizMetadata 초기화 후 저장
			Map<String, String> metadata = Map.of(
				"startTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")),
				"total", String.valueOf(quizList.size()),
				"currentIndex", "0",
				"collectionId", Integer.toString(collectionId)
			);
			redisTemplate.opsForHash().put(redisKey, "metadata", objectMapper.writeValueAsString(metadata));

		} catch (JsonProcessingException e) {
			throw new RuntimeException("퀴즈 게임 레디스 저장 예외");
		}
		return sessionId;

	}

	// Quiz 상태 업데이트
	public void updateQuizStatus(int userId, String sessionId, String quizId, String userAnswer, Boolean isCorrect) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			// quizStatus 가져오기
			String quizStatusJson = (String)redisTemplate.opsForHash().get(redisKey, "quizStatus");
			Map<String, Map<String, String>> quizStatus = objectMapper.readValue(quizStatusJson, Map.class);
			// 상태 갱신
			Map<String, String> quizState = quizStatus.get(quizId);
			if (quizState.get("attempted").equals("true")) {
				throw new RuntimeException("이미 푼 문제에 대해서 재요청 시 처리");
			}
			quizState.put("correct", String.valueOf(isCorrect));
			quizState.put("attempted", "true");
			quizState.put("answer", userAnswer);
			quizStatus.put(quizId, quizState);

			// 갱신된 상태 저장
			redisTemplate.opsForHash().put(redisKey, "quizStatus", objectMapper.writeValueAsString(quizStatus));

			// 메타데이터 업데이트 (currentIndex 증가)
			String metadataJson = (String)redisTemplate.opsForHash().get(redisKey, "metadata");
			Map<String, String> metadata = objectMapper.readValue(metadataJson, Map.class);
			int currentIndex = Integer.parseInt(metadata.get("currentIndex"));
			metadata.put("currentIndex", String.valueOf(currentIndex + 1));
			redisTemplate.opsForHash().put(redisKey, "metadata", objectMapper.writeValueAsString(metadata));

		} catch (Exception e) {
			throw new RuntimeException("Failed to update quiz status in Redis", e);
		}
	}

	// Quiz 세션 조회 (유효성 검사 포함)
	public Map<String, Object> getQuizSession(int userId, String sessionId) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			Map<String, Object> sessionData = new HashMap<>();

			// quizList 가져오기
			String quizListJson = (String)redisTemplate.opsForHash().get(redisKey, "quizList");
			if (quizListJson == null || quizListJson.isEmpty()) {
				throw new RuntimeException("Quiz list not found for session: " + sessionId);
			}
			List<String> quizList = objectMapper.readValue(quizListJson, List.class);
			sessionData.put("quizList", quizList);

			// quizStatus 가져오기
			String quizStatusJson = (String)redisTemplate.opsForHash().get(redisKey, "quizStatus");
			if (quizStatusJson == null || quizStatusJson.isEmpty()) {
				throw new RuntimeException("Quiz status not found for session: " + sessionId);
			}
			Map<String, Map<String, String>> quizStatus = objectMapper.readValue(quizStatusJson, Map.class);
			sessionData.put("quizStatus", quizStatus);

			// metadata 가져오기
			String metadataJson = (String)redisTemplate.opsForHash().get(redisKey, "metadata");
			if (metadataJson == null || metadataJson.isEmpty()) {
				throw new RuntimeException("Metadata not found for session: " + sessionId);
			}
			Map<String, String> metadata = objectMapper.readValue(metadataJson, Map.class);
			sessionData.put("metadata", metadata);

			return sessionData;

		} catch (Exception e) {
			throw new RuntimeException("Failed to retrieve quiz session from Redis", e);
		}
	}

	// 세션 데이터 삭제
	public void deleteQuizSession(int userId, String sessionId) {
		String redisKey = generateRedisKey(userId, sessionId);
		redisTemplate.delete(redisKey);
	}

	// Redis Key 생성 메서드
	private String generateRedisKey(int userId, String sessionId) {
		return userId + ":" + sessionId + ":quizData";
	}
}
