package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizDeleteRequest {
	private List<@Positive(message = "quizId는 0보다 커야 합니다.") Long> quizId;
	private List<@Positive(message = "sourceId는 0보다 커야 합니다.") Integer> sourceId;

	public boolean hasQuizIds() {
		return quizId != null && !quizId.isEmpty();
	}

	public boolean hasSourceIds() {
		return sourceId != null && !sourceId.isEmpty();
	}
}
