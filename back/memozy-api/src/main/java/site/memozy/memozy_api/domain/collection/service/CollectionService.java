package site.memozy.memozy_api.domain.collection.service;

import java.util.List;

import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;

public interface CollectionService {
	void createCollection(CustomOAuth2User user, CollectionCreateRequest request);

	void deleteCollection(CustomOAuth2User user, CollectionDeleteRequest request);

	void updateCollection(CustomOAuth2User user, Integer CollectionId, CollectionUpdateRequest request);

	List<CollectionSummaryResponse> getAllCollections(CustomOAuth2User user);
}
