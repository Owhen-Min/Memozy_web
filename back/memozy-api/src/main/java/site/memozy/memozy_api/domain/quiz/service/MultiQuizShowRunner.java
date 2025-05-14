package site.memozy.memozy_api.domain.quiz.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.PeriodicTrigger;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowResultEvent;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiQuizShowRunner {

	private final MultiQuizShowRedisRepository redisRepository;
	private final SimpMessagingTemplate messagingTemplate;

	private final TaskScheduler quizTaskScheduler;
	private final Map<String, ScheduledFuture<?>> activeTasks = new ConcurrentHashMap<>();
	private final Map<String, Integer> activeQuestionIndex = new ConcurrentHashMap<>();
	private static final int DEFAULT_INTERVAL = 10000;
	private final ApplicationEventPublisher applicationEventPublisher;

	public void startQuizShow(String showId) {
		if (activeTasks.containsKey(showId)) {
			log.warn("퀴즈쇼 {} 는 이미 실행 중입니다.", showId);
			throw new GeneralException(QUIZ_INVALID_STATE);
		}
		log.info("퀴즈쇼 시작: {}", showId);

		int quizCount = redisRepository.getQuizCount(showId);
		activeQuestionIndex.put(showId, 0);

		PeriodicTrigger trigger = new PeriodicTrigger(DEFAULT_INTERVAL);
		trigger.setFixedRate(true);

		ScheduledFuture<?> future = quizTaskScheduler.schedule(() -> {
			int index = activeQuestionIndex.get(showId);
			if (index >= quizCount) {
				stopQuizShow(showId);
				applicationEventPublisher.publishEvent(new QuizShowResultEvent(showId));
				return;
			}

			try {
				Map<String, Object> quiz = redisRepository.getQuizByIndex(showId, index);
				log.info("{} 퀴즈쇼 {}번째 퀴즈 전송: {}", showId, index, quiz);
				if (quiz == null) {
					log.error("퀴즈쇼 문제 오류 = {}번째 문제부터", index);
					throw new GeneralException(QUIZ_INVALID_STATE);
				}
				sendQuiz(showId, index, quiz);
				activeQuestionIndex.put(showId, index + 1);
			} catch (Exception e) {
				log.error("퀴즈쇼 {} 에서 오류 발생: {}", showId, e.getMessage());
				stopQuizShow(showId);
			}
		}, trigger);

		activeTasks.put(showId, future);
	}

	private void sendQuiz(String showId, int index, Map<String, Object> quiz) {
		Map<String, Object> quizData = Map.of(
			"content", quiz.get("content"),
			"choice", quiz.get("choice"),
			"type", quiz.get("type"),
			"answer", quiz.get("answer"),
			"commentary", quiz.get("commentary")
		);

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/quiz",
			Map.of(
				"type", "QUIZ",
				"quiz", quizData,
				"index", index
			)
		);
	}

	private void stopQuizShow(String showId) {
		ScheduledFuture<?> future = activeTasks.remove(showId);
		if (future != null) {
			future.cancel(false);
		}
		activeQuestionIndex.remove(showId);
		log.info("퀴즈쇼 {} 종료", showId);
	}
}
