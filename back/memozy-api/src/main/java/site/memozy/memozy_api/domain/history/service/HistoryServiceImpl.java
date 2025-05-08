package site.memozy.memozy_api.domain.history.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.repository.HistoryRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

	private final HistoryRepository historyRepository;
	private final CollectionRepository collectionRepository;

	@Override
	@Transactional(readOnly = true)
	public List<HistoryContributeResponse> getUserStreaks(Integer userId, Integer year) {
		LocalDate startDate;
		LocalDate endDate;

		if (year == null) {
			endDate = LocalDate.now();
			startDate = endDate.minusMonths(11).withDayOfMonth(1);
		} else {
			startDate = LocalDate.of(year, 1, 1);
			endDate = LocalDate.of(year, 12, 31);
		}

		List<Integer> collectionIds = collectionRepository.findCollectionIdsByUserId(userId);
		if (collectionIds.isEmpty()) {
			return Collections.emptyList();
		}

		return historyRepository.findContributionsByCollectionIdsAndDateRange(
			collectionIds, startDate, endDate
		);
	}

}
