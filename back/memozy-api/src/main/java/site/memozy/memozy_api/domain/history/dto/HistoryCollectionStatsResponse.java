package site.memozy.memozy_api.domain.history.dto;

import java.util.List;

public record HistoryCollectionStatsResponse(
	List<CollectionAccuracyResponse> collectionAccuracyResponses,
	QuizCountAnalysisResponse quizCountAnalysisResponse
) {
}
