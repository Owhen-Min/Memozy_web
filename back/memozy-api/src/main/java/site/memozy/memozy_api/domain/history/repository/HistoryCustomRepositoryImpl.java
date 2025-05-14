package site.memozy.memozy_api.domain.history.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.dto.LearningContributionResponse;
import site.memozy.memozy_api.domain.history.entity.QHistory;

@RequiredArgsConstructor
public class HistoryCustomRepositoryImpl implements HistoryCustomRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public LearningContributionResponse findTotalContributionsByUserEmailAndCollectionIds(
		List<Integer> collectionIds,
		String userEmail
	) {
		QHistory history = QHistory.history;

		LocalDate firstStudyDate = Optional.ofNullable(
				queryFactory.select(history.createdAt.min())
					.from(history)
					.where(
						history.collectionId.in(collectionIds)
							.or(history.collectionId.eq(0).and(history.email.eq(userEmail)))
					)
					.fetchFirst()
			).map(LocalDateTime::toLocalDate)
			.orElse(null);

		if (firstStudyDate == null) {
			return new LearningContributionResponse(null, List.of());
		}

		LocalDate today = LocalDate.now();

		DateTemplate<Date> groupedDate = groupingDate(history);

		List<Tuple> results = queryFactory
			.select(groupedDate, history.count())
			.from(history)
			.where(
				(history.collectionId.in(collectionIds)
					.or(history.collectionId.eq(0).and(history.email.eq(userEmail)))),
				history.createdAt.between(firstStudyDate.atStartOfDay(), today.plusDays(1).atStartOfDay())
			)
			.groupBy(groupedDate)
			.fetch();

		Map<LocalDate, Integer> countMap = convertLocalDateMap(results, groupedDate, history);

		List<HistoryContributeResponse> learningContribution = generateContributeResponse(firstStudyDate, today,
			countMap);

		return new LearningContributionResponse(firstStudyDate, learningContribution);
	}

	private static DateTemplate<Date> groupingDate(QHistory history) {
		return Expressions.dateTemplate(
			Date.class, "date({0})", history.createdAt
		);
	}

	private static Map<LocalDate, Integer> convertLocalDateMap(List<Tuple> results, DateTemplate<Date> groupedDate,
		QHistory history) {
		return results.stream()
			.collect(Collectors.toMap(
				tuple -> tuple.get(groupedDate).toLocalDate(),
				tuple -> {
					Long rawCount = tuple.get(history.count());
					return rawCount != null ? rawCount.intValue() : 0;
				},
				Integer::sum)
			);
	}

	private List<HistoryContributeResponse> generateContributeResponse(LocalDate firstStudyDate, LocalDate today,
		Map<LocalDate, Integer> countMap) {
		List<HistoryContributeResponse> learningContribution = new ArrayList<>();
		for (LocalDate date = firstStudyDate; !date.isAfter(today); date = date.plusDays(1)) {
			int count = countMap.getOrDefault(date, 0);
			int level = calculateLevel(count);
			learningContribution.add(new HistoryContributeResponse(Date.valueOf(date), count, level));
		}
		return learningContribution;
	}

	private int calculateLevel(int count) {
		if (count == 0) {
			return 0;
		} else if (count <= 4) {
			return 1;
		} else if (count <= 9) {
			return 2;
		} else if (count <= 14) {
			return 3;
		} else {
			return 4;
		}
	}
}
