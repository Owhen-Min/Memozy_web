package site.memozy.memozy_api.domain.history.entity;

import java.util.List;

public record QuizDetailResponse(
	Long quizId,
	String content,
	String type,
	String userSelect,
	List<String> choice,
	String answer,
	String commentary
) {
}
