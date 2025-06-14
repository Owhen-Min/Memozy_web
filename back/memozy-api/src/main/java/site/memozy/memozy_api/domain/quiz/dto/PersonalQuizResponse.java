package site.memozy.memozy_api.domain.quiz.dto;

import java.util.Arrays;
import java.util.List;

import com.querydsl.core.annotations.QueryProjection;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.domain.quiz.entity.QuizType;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PersonalQuizResponse {
	private Long quizId;
	private String content;
	private QuizType type;
	private List<String> choice;
	private String answer;
	private String commentary;

	@QueryProjection
	public PersonalQuizResponse(Long quizId, String content, QuizType type, String choice, String answer,
		String commentary) {
		this.quizId = quizId;
		this.content = content;
		this.type = type;
		if (choice != null) {
			this.choice = Arrays.asList(choice.split("№"));
		}
		this.answer = answer;
		this.commentary = commentary;
	}
}
