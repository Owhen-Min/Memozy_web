package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;

import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;

public interface CollectionRepositoryCustom {
	List<CollectionSummaryResponse> findCollectionSummariesByUserId(Integer userId);
}
