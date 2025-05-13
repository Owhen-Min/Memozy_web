package site.memozy.memozy_api.domain.quiz.service;

import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.PeriodicTrigger;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.QuizShowResultEvent;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiQuizShowRunner {

	private final MultiQuizShowRedisRepository redisRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final QuizShowEventListener quizShowEventListener;
	private final TaskScheduler quizTaskScheduler;

	private final ObjectMapper objectMapper = new ObjectMapper();

	public void startQuizShow(String showId, long intervalMillis) {
		log.info("퀴즈쇼 시작: {}", showId);
		int quizCount = redisRepository.getQuizCount(showId);
		AtomicInteger index = new AtomicInteger(0);

		// Trigger 기반으로 전환 (Spring 6 대응)
		PeriodicTrigger trigger = new PeriodicTrigger(intervalMillis);
		trigger.setFixedRate(true);
		trigger.setInitialDelay(0);

		quizTaskScheduler.schedule(() -> {
			int i = index.getAndIncrement();
			if (i >= quizCount) {
				messagingTemplate.convertAndSend(
					"/sub/quiz/show/" + showId + "/end",
					Map.of("message", "퀴즈가 종료되었습니다.")
				);
				quizShowEventListener.handleQuizShowResult(new QuizShowResultEvent(showId));
				return;
			}

			try {
				String quiz = redisRepository.getQuizByIndex(showId, i);
				log.info("퀴즈 전송: {}", quiz);
				if (quiz == null)
					return;

				messagingTemplate.convertAndSend(
					"/sub/quiz/show/" + showId + "/quiz",
					Map.of(
						"index", i,
						"quiz", quiz
					)
				);

			} catch (Exception e) {
				log.error("퀴즈 전송 중 오류 발생", e);
			}
		}, trigger);
	}
}
