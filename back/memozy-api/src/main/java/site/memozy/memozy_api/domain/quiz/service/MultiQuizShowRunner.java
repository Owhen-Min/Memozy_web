package site.memozy.memozy_api.domain.quiz.service;

import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.repository.MultiQuizShowRedisRepository;

@Service
@RequiredArgsConstructor
public class MultiQuizShowRunner {

	private final MultiQuizShowRedisRepository redisRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final QuizShowEventListener quizShowEventListener;

	@Async
	public void startQuizShow(String showId, long intervalMillis) {
		int quizCount = redisRepository.getQuizCount(showId);

		for (int i = 0; i < quizCount; i++) {
			String quiz = redisRepository.getQuizByIndex(showId, i);

			if (quiz == null)
				continue;

			messagingTemplate.convertAndSend(
				"/sub/quiz/show/" + showId + "/quiz",
				Map.of(
					"index", i,
					"quiz", quiz
				)
			);

			try {
				Thread.sleep(intervalMillis);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
				break;
			}
		}

		messagingTemplate.convertAndSend(
			"/sub/quiz/show/" + showId + "/end",
			Map.of("message", "퀴즈가 종료되었습니다.")
		);

		//quizShowEventListener.handleQuizShowResultEvent(new )
	}
}
