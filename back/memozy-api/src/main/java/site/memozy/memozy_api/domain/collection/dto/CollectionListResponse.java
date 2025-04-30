package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionListResponse {
	private List<CollectionSummaryResponse> data;

	public static CollectionListResponse from(List<CollectionSummaryResponse> data) {
		CollectionListResponse response = new CollectionListResponse();
		response.data = data;
		return response;
	}
	
}
