package site.memozy.memozy_api.domain.history.service;

import java.util.List;

import site.memozy.memozy_api.domain.history.dto.HistoryCollectionStatsResponse;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.dto.QuizStatsResponse;
import site.memozy.memozy_api.domain.history.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.history.entity.CollectionHistoryDetailResponse;

public interface HistoryService {
	List<HistoryContributeResponse> getUserStreaks(Integer userId, Integer year);

	QuizStatsResponse getUserQuizStats(Integer userId);

	List<UnsolvedCollectionDtoResponse> getUnsolvedCollections(Integer userId);

	HistoryCollectionStatsResponse getCollectionAccuracy(Integer userId);

	List<CollectionHistoryDetailResponse> getCollectionHistoryDetail(Integer userId, Integer collectionId);

}
