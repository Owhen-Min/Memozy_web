package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizCreateRequest {

	@Min(value = 1, message = "퀴즈 개수는 최소 1개 이상이어야 합니다.")
	@Max(value = 10, message = "퀴즈 개수는 최대 10개까지 가능합니다.")
	private Integer quizCount;

	@NotEmpty(message = "퀴즈 타입은 비어있을 수 없습니다.")
	private List<String> quizTypes;
}
