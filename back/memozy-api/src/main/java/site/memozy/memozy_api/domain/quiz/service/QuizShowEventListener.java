package site.memozy.memozy_api.domain.quiz.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.MyMultiQuizShowResultResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowJoinEvent;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowParticipantEvent;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowResultEvent;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowStartEvent;
import site.memozy.memozy_api.domain.quiz.dto.TopQuizResultResponse;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuizShowEventListener {

	private final SimpMessagingTemplate messagingTemplate;
	private final RedisTemplate<String, Object> redisTemplate;
	private final MultiQuizShowRedisRepository multiQuizShowRedisRepository;

	@EventListener
	public void handleJoinQuizShowEvent(QuizShowJoinEvent event) {
		String showId = event.showId();
		String type = "JOIN";

		Map<String, String> metaData = multiQuizShowRedisRepository.getQuizMetaData(showId);
		if (metaData.get("hostId").equals(event.userId())) {
			type = "HOST";
		}

		sendToParticipant(type, showId, event.userId(), event.nickname(), metaData);
		broadcastParticipants("JOIN", showId);
	}

	@EventListener
	public void handleParticipantNicknameEvent(QuizShowParticipantEvent event) {
		String showId = event.showId();
		String userId = event.userId();
		String nickname = event.nickname();
		String type = "NICKNAME";

		sendToUser(type, showId, userId, nickname);
		broadcastParticipants("NICKNAME", showId);
	}

	@EventListener
	public void handleQuizShowStartEvent(QuizShowStartEvent event) {
		String showId = event.showId();
		String type = "START";

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/join",
			Map.of("type", type)
		);
	}

	@EventListener
	public void handleQuizShowResultEvent(QuizShowResultEvent event) {
		log.info("[Event] QuizShowResultEvent triggered for showId: {}", event.showId());
		String showId = event.showId();
		int quizCount = multiQuizShowRedisRepository.getQuizCount(showId);
		Set<Object> userIds = multiQuizShowRedisRepository.findParticipants(showId);

		List<MyMultiQuizShowResultResponse> results = new ArrayList<>();
		Map<Integer, Integer> wrongCounts = new HashMap<>();
		for (int i = 0; i < quizCount; i++) {
			wrongCounts.put(i, 0);
		}

		for (Object id : userIds) {
			String userId = id.toString();
			Map<String, String> userAnswers = multiQuizShowRedisRepository.getUserChoice(showId, userId);

			int correctCount = 0;
			for (Map.Entry<String, String> entry : userAnswers.entrySet()) {
				String key = entry.getKey();
				if (!key.endsWith("_choice"))
					continue;

				int index = Integer.parseInt(key.replace("_choice", ""));
				boolean isCorrect = Boolean.parseBoolean(entry.getValue());

				if (isCorrect) {
					correctCount++;
				} else {
					wrongCounts.put(index, wrongCounts.getOrDefault(index, 0) + 1);
				}
			}

			int score = (int)Math.round((correctCount * 100.0) / quizCount);
			Map<String, String> participantInfo = multiQuizShowRedisRepository.getParticipantInfo(showId, userId);
			String nickname = participantInfo.get("nickname");

			results.add(new MyMultiQuizShowResultResponse(userId, nickname, correctCount, quizCount, score));
		}

		results.sort(Comparator.comparingInt(MyMultiQuizShowResultResponse::myScore).reversed());
		List<TopQuizResultResponse> topRanks = new ArrayList<>();
		for (int i = 0; i < Math.min(3, results.size()); i++) {
			MyMultiQuizShowResultResponse response = results.get(i);
			topRanks.add(new TopQuizResultResponse(i + 1, response.nickname(), response.myScore()));
		}

		for (MyMultiQuizShowResultResponse result : results) {
			messagingTemplate.convertAndSend(
				"/sub/quiz/show/" + showId + "/result/" + result.userId(),
				Map.of(
					"type", "MYRESULT",
					"result", result
				)
			);
		}

		int mostWrongIndex = wrongCounts.entrySet().stream()
			.max(Map.Entry.comparingByValue())
			.map(Map.Entry::getKey)
			.orElse(0);

		Map<String, Object> mostWrongQuiz = new HashMap<>(
			multiQuizShowRedisRepository.getQuizByIndex(showId, mostWrongIndex));
		log.info("Most wrong quiz index: {}", mostWrongIndex);
		mostWrongQuiz.put("wrongRate", (double)wrongCounts.get(mostWrongIndex) / userIds.size());

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/result",
			Map.of(
				"type", "RESULT",
				"mostWrongQuiz", mostWrongQuiz,
				"topRanking", topRanks
			)
		);
	}

	private void sendToUser(String type, String showId, String userId, String nickname) {
		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/join",
			Map.of(
				"type", type,
				"userId", userId,
				"nickname", nickname
			)
		);
	}

	private void sendToParticipant(String type, String showId, String userId, String nickname,
		Map<String, String> metaData) {
		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/join",
			Map.of(
				"type", type,
				"userId", userId,
				"nickname", nickname,
				"hostId", metaData.get("hostId"),
				"hostName", metaData.get("hostName"),
				"collectionName", metaData.get("collectionName"),
				"quizCount", metaData.get("quizCount")
			)
		);
	}

	private void broadcastParticipants(String type, String showId) {
		Set<Object> members = multiQuizShowRedisRepository.findParticipants(showId);
		List<Map<String, String>> users = members.stream()
			.map(userId -> {
				Map<Object, Object> userMap = redisTemplate.opsForHash().entries("show:" + showId + ":user:" + userId);
				Map<String, String> result = new HashMap<>();
				result.put("userId", userId.toString());
				result.put("nickname", (String)userMap.get("nickname"));
				return result;
			})
			.filter(Objects::nonNull)
			.toList();

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/participants",
			Map.of(
				"type", type,
				"participants", users
			)
		);
	}

}
