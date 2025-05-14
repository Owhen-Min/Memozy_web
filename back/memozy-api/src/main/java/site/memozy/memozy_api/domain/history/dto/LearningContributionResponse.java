package site.memozy.memozy_api.domain.history.dto;

import java.time.LocalDate;
import java.util.List;

public record LearningContributionResponse(LocalDate firstStudyDate,
										   List<HistoryContributeResponse> learningContribution) {
}
