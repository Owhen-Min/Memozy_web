package site.memozy.memozy_api.domain.history.service;

import java.util.List;

import site.memozy.memozy_api.domain.collection.dto.CollectionAccuracyResponse;
import site.memozy.memozy_api.domain.collection.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.dto.QuizStatsResponse;

public interface HistoryService {
	List<HistoryContributeResponse> getUserStreaks(Integer userId, Integer year);

	QuizStatsResponse getUserQuizStats(Integer userId);

	List<UnsolvedCollectionDtoResponse> getUnsolvedCollections(Integer userId);

	List<CollectionAccuracyResponse> getCollectionAccuracy(Integer userId);
}
