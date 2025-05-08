package site.memozy.memozy_api.domain.history.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuizStatsResponse {
	private long totalQuizCount;
	private long solvedQuizCount;
}
