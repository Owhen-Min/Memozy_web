package site.memozy.memozy_api.domain.history.repository;

import java.time.LocalDate;
import java.util.List;

import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;

public interface HistoryCustomRepository {
	List<HistoryContributeResponse> findContributionsByCollectionIdsAndDateRange(List<Integer> collectionIds,
		LocalDate startDate, LocalDate endDate
	);
}
