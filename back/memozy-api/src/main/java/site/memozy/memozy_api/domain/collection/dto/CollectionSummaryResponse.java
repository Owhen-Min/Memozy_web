package site.memozy.memozy_api.domain.collection.dto;

import com.querydsl.core.annotations.QueryProjection;

import lombok.Getter;

@Getter
public class CollectionSummaryResponse {
	private Integer id;
	private String name;
	private Long memozyCount;
	private Long quizCount;

	@QueryProjection
	public CollectionSummaryResponse(Integer collectionId, String name, Long quizCount, Long sourceCount) {
		this.id = collectionId;
		this.name = name;
		this.memozyCount = sourceCount;
		this.quizCount = quizCount;
	}
}
