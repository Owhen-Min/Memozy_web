package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import site.memozy.memozy_api.domain.quiz.entity.Quiz;

public record QuizItemResponse(
	@JsonProperty("quiz_type") int quizType,
	String question,
	List<String> options,
	String answer,
	String explanation
) {

	public Quiz toEntity(Integer sourceId) {
		return Quiz.createQuiz(this, sourceId);
	}
}
