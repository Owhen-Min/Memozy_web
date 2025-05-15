package site.memozy.memozy_api.domain.quiz.dto.internal;

import com.querydsl.core.annotations.QueryProjection;

import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.domain.quiz.entity.QuizType;

@NoArgsConstructor
@Getter
public class QuizShowKey {
	private String content;
	private String answer;
	private QuizType type;

	@QueryProjection
	public QuizShowKey(String content, String answer, QuizType type) {
		this.content = content;
		this.answer = answer;
		this.type = type;
	}
}
