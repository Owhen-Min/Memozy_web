package site.memozy.memozy_api.domain.history.service;

import java.util.List;

import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;

public interface HistoryService {
	List<HistoryContributeResponse> getUserStreaks(Integer userId, Integer year);
}
