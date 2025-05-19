package site.memozy.memozy_api.domain.quiz.dto;

import com.querydsl.core.annotations.QueryProjection;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.domain.quiz.entity.QuizType;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MultiQuizResponse {
	private Long quizId;
	private String content;
	private QuizType type;
	private String choice;
	private String answer;
	private String commentary;

	@QueryProjection
	public MultiQuizResponse(Long quizId, String content, QuizType type, String choice, String answer,
		String commentary) {
		this.quizId = quizId;
		this.content = content;
		this.type = type;
		this.choice = choice.toString();
		this.answer = answer;
		this.commentary = commentary;
	}
}
