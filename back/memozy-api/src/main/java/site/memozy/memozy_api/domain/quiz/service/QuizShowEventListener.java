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
		String type = "join";

		String hostUserId = multiQuizShowRedisRepository.getQuizMetaData(showId).get("hostId");
		if (hostUserId.equals(event.userId())) {
			type = "host";
		}

		sendToParticipant(showId, type, event);
		broadcastParticipants(showId);
	}

	@EventListener
	public void handleParticipantNicknameEvent(QuizShowParticipantEvent event) {
		String showId = event.showId();
		String userId = event.userId();
		String nickname = event.nickname();

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/join",
			Map.of(
				"type", "NICKNAME",
				"userId", userId,
				"nickname", nickname
			)
		);

		broadcastParticipants(showId);
	}

	@EventListener
	public void handleQuizShowResultEvent(QuizShowResultEvent event) {
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

	private void sendToParticipant(String showId, String type, QuizShowJoinEvent event) {
		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/join",
			Map.of(
				"type", type,
				"userId", event.userId(),
				"nickname", event.nickname(),
				"hostName", event.hostName(),
				"collectionName", event.collectionName(),
				"quizCount", event.quizCount()
			)
		);
	}

	private void broadcastParticipants(String showId) {
		Set<Object> members = multiQuizShowRedisRepository.findParticipants(showId);
		List<String> users = members.stream()
			.map(id -> redisTemplate.opsForHash().entries("show:" + showId + ":user:" + id))
			.filter(Objects::nonNull)
			.map(user -> (String)user.get("nickname"))
			.toList();

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/participants",
			Map.of(
				"type", "PARTICIPANT_LIST",
				"participants", users
			)
		);
	}

}
