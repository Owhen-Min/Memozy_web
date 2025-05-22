package site.memozy.memozy_api.domain.collection.dto;

import com.querydsl.core.annotations.QueryProjection;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.domain.quiz.entity.QuizType;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizSummaryResponse {
	private Long quizId;
	private String quizContent;
	private QuizType quizType;

	@QueryProjection
	public QuizSummaryResponse(Long quizId, String quizContent, QuizType quizType) {
		this.quizId = quizId;
		this.quizContent = quizContent;
		this.quizType = quizType;
	}
}
