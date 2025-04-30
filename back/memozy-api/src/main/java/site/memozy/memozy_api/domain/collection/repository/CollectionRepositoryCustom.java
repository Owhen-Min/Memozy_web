package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;
import java.util.Optional;

import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.entity.Collection;

public interface CollectionRepositoryCustom {
	List<CollectionSummaryResponse> findCollectionSummariesByUserId(Integer userId);

	Optional<Collection> findByCollectionIdAndUserId(Integer collectionId, Integer userId);
}
