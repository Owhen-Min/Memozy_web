package site.memozy.memozy_api.domain.quiz.dto;

import com.querydsl.core.annotations.QueryProjection;

import site.memozy.memozy_api.domain.quiz.entity.QuizType;

public record QuizSelectResponse(
	long quizId,
	String type,
	String content
) {

	@QueryProjection
	public QuizSelectResponse(long quizId, QuizType type, String content) {
		this(quizId, type.getTypeDescription(), content);
	}
}
