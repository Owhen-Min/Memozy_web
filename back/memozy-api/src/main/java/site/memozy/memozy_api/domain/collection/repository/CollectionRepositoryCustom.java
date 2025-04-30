package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;

import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;

public interface CollectionRepositoryCustom {
	List<CollectionSummaryResponse> findCollectionSummariesByUserId(Integer userId);

	List<QuizSummaryResponse> findQuizSummariesBySourceIdAndUserId(Integer sourceId, Integer userId);
}
