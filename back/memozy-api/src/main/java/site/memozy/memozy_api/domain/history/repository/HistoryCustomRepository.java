package site.memozy.memozy_api.domain.history.repository;

import java.util.List;

import site.memozy.memozy_api.domain.history.dto.LearningContributionResponse;

public interface HistoryCustomRepository {
	LearningContributionResponse findTotalContributionsByUserEmailAndCollectionIds(List<Integer> collectionIds,
		String userEmail);
}
