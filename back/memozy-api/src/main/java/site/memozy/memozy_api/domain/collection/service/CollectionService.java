package site.memozy.memozy_api.domain.collection.service;

import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionListResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;

public interface CollectionService {
	void createCollection(CustomOAuth2User user, CollectionCreateRequest request);

	void deleteCollection(CustomOAuth2User user, CollectionDeleteRequest request);

	void updateCollection(CustomOAuth2User user, Integer CollectionId, CollectionUpdateRequest request);

	CollectionListResponse getAllCollections(CustomOAuth2User user);
}
