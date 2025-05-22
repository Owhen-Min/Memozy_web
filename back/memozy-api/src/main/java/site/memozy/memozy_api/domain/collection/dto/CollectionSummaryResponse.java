package site.memozy.memozy_api.domain.collection.dto;

import com.querydsl.core.annotations.QueryProjection;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CollectionSummaryResponse {
	private Integer id;
	private String name;
	private Long memozyCount; // JPAExpressions.select의 리턴 값이 Long
	private Long quizCount;

	@QueryProjection
	public CollectionSummaryResponse(Integer collectionId, String name, Long quizCount, Long sourceCount) {
		this.id = collectionId;
		this.name = name;
		this.memozyCount = sourceCount;
		this.quizCount = quizCount;
	}

	public static CollectionSummaryResponse of(Long memozyCount, Long quizCount) {
		CollectionSummaryResponse response = new CollectionSummaryResponse();
		response.id = 0;
		response.name = "모두 보기";
		response.memozyCount = memozyCount;
		response.quizCount = quizCount;
		return response;
	}
}
