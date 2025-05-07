package site.memozy.memozy_api.domain.quizsource.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class QuizSourceResponse {

	private Integer sourceId;
	private String title;
	private String summary;
	private String url;
	private Integer userId;

	private Integer collectionId;

	public static QuizSourceResponse of(QuizSource source) {
		return new QuizSourceResponse(
			source.getSourceId(),
			source.getTitle(),
			source.getSummary(),
			source.getUrl(),
			source.getUserId(),
			source.getCollectionId()
		);
	}
}
