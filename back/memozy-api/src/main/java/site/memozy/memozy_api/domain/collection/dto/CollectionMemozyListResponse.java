package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionMemozyListResponse {
	private String collectionName;
	private List<MemozyContentResponse> content;
	private int offset;
	private int page;
	private boolean last;
}
