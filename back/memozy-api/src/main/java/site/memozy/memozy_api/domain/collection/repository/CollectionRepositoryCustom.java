package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.MemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.history.dto.CollectionAccuracyResponse;
import site.memozy.memozy_api.domain.history.dto.UnsolvedCollectionDtoResponse;

public interface CollectionRepositoryCustom {
	List<CollectionSummaryResponse> findCollectionSummariesByUserId(Integer userId);

	List<UnsolvedCollectionDtoResponse> findUnsolvedCollectionsByUserId(Integer userId);

	List<QuizSummaryResponse> findQuizSummariesBySourceIdAndUserId(Integer sourceId, Integer userId);

	List<Long> findValidQuizIdsByUser(List<Long> requestedQuizIds, Integer currentUserId);

	List<Integer> findValidSourceIdsByUser(List<Integer> requestedSourceIds, Integer currentUserId);

	List<MemozyContentResponse> findByCollectionIdWithPaging(Integer collectionId, Pageable pageable);

	long countByCollectionId(Integer collectionId);

	List<CollectionAccuracyResponse> findAccuracyByCollectionIds(List<Integer> collectionIds);
}
