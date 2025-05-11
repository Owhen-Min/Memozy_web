package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

public record QuizRebuildRequest(
	List<Long> quizIdList,
	List<String> quizTypes
) {
}
