package site.memozy.memozy_api.domain.history.entity;

import java.util.List;

public record CollectionHistoryDetailResponse(
	Integer historyId,
	Integer round,
	Integer failCount,
	Integer allCount,
	String date,
	List<QuizDetailResponse> quizDataList
) {
}
