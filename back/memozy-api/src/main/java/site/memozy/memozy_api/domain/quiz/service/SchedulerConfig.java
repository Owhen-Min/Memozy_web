package site.memozy.memozy_api.domain.quiz.service;

// Config 클래스

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class SchedulerConfig {

	@Bean
	public ThreadPoolTaskScheduler quizTaskScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(4);
		scheduler.setThreadNamePrefix("quiz-scheduler-");
		scheduler.initialize();
		return scheduler;
	}
}
