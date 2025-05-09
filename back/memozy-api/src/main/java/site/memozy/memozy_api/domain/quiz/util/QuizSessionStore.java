package site.memozy.memozy_api.domain.quiz.util;

import java.time.Duration;
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

// TODO: Redis TTL 설정하기
@Component
@RequiredArgsConstructor
public class QuizSessionStore {
	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public static final String QUIZ_LIST_KEY = "quizList";
	public static final String QUIZ_STATUS_KEY = "quizStatus";
	public static final String METADATA_KEY = "metadata";

	// Quiz 세션 저장
	public void saveQuizSession(int userId, List<String> quizList, String sessionId, int collectionId) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			// quizList 저장
			redisTemplate.opsForHash().put(redisKey, QUIZ_LIST_KEY, objectMapper.writeValueAsString(quizList));

			// quizStatus 초기화 후 저장
			Map<String, Map<String, String>> quizStatus = new HashMap<>();
			for (String quizId : quizList) {
				Map<String, String> status = new HashMap<>();
				status.put("correct", "null");
				status.put("attempted", "false");
				status.put("answer", "");
				quizStatus.put(quizId, status);
			}
			redisTemplate.opsForHash().put(redisKey, QUIZ_STATUS_KEY, objectMapper.writeValueAsString(quizStatus));

			// quizMetadata 초기화 후 저장
			Map<String, String> metadata = Map.of(
				"startTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")),
				"total", String.valueOf(quizList.size()),
				"currentIndex", "0",
				"collectionId", Integer.toString(collectionId)
			);
			redisTemplate.opsForHash().put(redisKey, METADATA_KEY, objectMapper.writeValueAsString(metadata));
			redisTemplate.expire(redisKey, Duration.ofDays(1));
		} catch (JsonProcessingException e) {
			throw new RuntimeException("비상 비상 퀴즈 게임 레디스 저장 예외");
		}
	}

	// Quiz 상태 업데이트
	public void updateQuizStatus(int userId, String sessionId, String quizId, String userAnswer, Boolean isCorrect) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			// quizStatus 가져오기
			String quizStatusJson = (String)redisTemplate.opsForHash().get(redisKey, QUIZ_STATUS_KEY);
			@SuppressWarnings("unchecked")
			Map<String, Map<String, String>> quizStatus = objectMapper.readValue(quizStatusJson, Map.class);

			// 상태 갱신
			Map<String, String> quizState = quizStatus.get(quizId);
			if (quizState == null || "true".equals(quizState.get("attempted"))) {
				throw new RuntimeException("비상 비상 이미 푼 문제에 대해서 재요청 시 처리");
			}
			quizState.put("correct", String.valueOf(isCorrect));
			quizState.put("attempted", "true");
			quizState.put("answer", userAnswer);
			quizStatus.put(quizId, quizState);

			// 갱신된 상태 저장
			redisTemplate.opsForHash().put(redisKey, QUIZ_STATUS_KEY, objectMapper.writeValueAsString(quizStatus));

			// 메타데이터 업데이트 (currentIndex 증가)
			String metadataJson = (String)redisTemplate.opsForHash().get(redisKey, METADATA_KEY);
			@SuppressWarnings("unchecked")
			Map<String, String> metadata = objectMapper.readValue(metadataJson, Map.class);
			int currentIndex = Integer.parseInt(metadata.get("currentIndex"));
			metadata.put("currentIndex", String.valueOf(currentIndex + 1));
			redisTemplate.opsForHash().put(redisKey, METADATA_KEY, objectMapper.writeValueAsString(metadata));

		} catch (Exception e) {
			throw new RuntimeException("비상 비상 업데이트 시, 퀴즈 게임 레디스 저장  예외");
		}
	}

	// Quiz 세션 조회 (유효성 검사 포함)
	public Map<String, Object> getQuizSession(int userId, String sessionId) {
		String redisKey = generateRedisKey(userId, sessionId);

		try {
			Map<String, Object> sessionData = new HashMap<>();

			// quizList 가져오기
			String quizListJson = (String)redisTemplate.opsForHash().get(redisKey, QUIZ_LIST_KEY);
			if (quizListJson == null || quizListJson.isEmpty()) {
				throw new RuntimeException("비상 비상 가져올 데이터가 없음1");
			}
			@SuppressWarnings("unchecked")
			List<String> quizList = objectMapper.readValue(quizListJson, List.class);
			sessionData.put(QUIZ_LIST_KEY, quizList);

			// quizStatus 가져오기
			String quizStatusJson = (String)redisTemplate.opsForHash().get(redisKey, QUIZ_STATUS_KEY);
			if (quizStatusJson == null || quizStatusJson.isEmpty()) {
				throw new RuntimeException("비상 비상 가져올 데이터가 없음2");
			}
			@SuppressWarnings("unchecked")
			Map<String, Map<String, String>> quizStatus = objectMapper.readValue(quizStatusJson, Map.class);
			sessionData.put(QUIZ_STATUS_KEY, quizStatus);

			// metadata 가져오기
			String metadataJson = (String)redisTemplate.opsForHash().get(redisKey, METADATA_KEY);
			if (metadataJson == null || metadataJson.isEmpty()) {
				throw new RuntimeException("비상 비상 가져올 데이터가 없음3");
			}
			@SuppressWarnings("unchecked")
			Map<String, String> metadata = objectMapper.readValue(metadataJson, Map.class);
			sessionData.put(METADATA_KEY, metadata);

			return sessionData;

		} catch (Exception e) {
			throw new RuntimeException("비상 비상 세션 조회 시 여외 발생!");
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
