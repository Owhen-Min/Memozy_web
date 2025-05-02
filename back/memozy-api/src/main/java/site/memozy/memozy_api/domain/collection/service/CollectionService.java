package site.memozy.memozy_api.domain.collection.service;

import java.util.List;

import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;

public interface CollectionService {
	void createCollection(Integer userId, CollectionCreateRequest request);

	void deleteCollection(Integer userId, CollectionDeleteRequest request);

	void updateCollection(Integer userId, Integer collectionId, CollectionUpdateRequest request);

	List<CollectionSummaryResponse> getAllCollections(Integer userId);

	List<QuizSummaryResponse> getQuizzesByCollectionUrl(Integer userId, Integer sourceId);

	void addQuizzesToCollection(Integer userId, Integer collectionId, List<Long> quizIds);

	void deleteQuizzesByRequest(Integer userId, QuizDeleteRequest request);
}
