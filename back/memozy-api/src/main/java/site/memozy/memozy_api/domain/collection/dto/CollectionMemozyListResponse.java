package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionMemozyListResponse {
	private String collectionName;
	private int duplicateQuizCount;
	private List<MemozyContentResponse> content;
	private boolean last;

	@Builder
	public CollectionMemozyListResponse(String collectionName, int duplicateQuizCount,
		List<MemozyContentResponse> content, boolean last) {
		this.collectionName = collectionName;
		this.duplicateQuizCount = duplicateQuizCount;
		this.content = content;
		this.last = last;
	}

}
