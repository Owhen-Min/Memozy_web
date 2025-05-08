package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizIdListRequest {
	@NotEmpty(message = "퀴즈 ID 리스트는 비어 있을 수 없습니다.")
	private List<Long> quizIdList;
}
