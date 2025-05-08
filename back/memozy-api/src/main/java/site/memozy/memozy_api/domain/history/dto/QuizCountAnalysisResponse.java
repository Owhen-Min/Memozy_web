package site.memozy.memozy_api.domain.history.dto;

import java.util.List;

public record QuizCountAnalysisResponse(
	List<TopCollectionResponse> topCollections,
	Integer otherCollectionsCount
) {
}
