package site.memozy.memozy_api.domain.history.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.entity.QHistory;

@RequiredArgsConstructor
public class HistoryCustomRepositoryImpl implements HistoryCustomRepository {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<HistoryContributeResponse> findContributionsByCollectionIdsAndDateRange(
		List<Integer> collectionIds,
		LocalDate startDate,
		LocalDate endDate
	) {
		QHistory history = QHistory.history;

		DateTemplate<Date> groupedDate = Expressions.dateTemplate(
			Date.class, "date({0})", history.createdAt
		);

		List<Tuple> results = queryFactory
			.select(groupedDate, history.count())
			.from(history)
			.where(
				history.collectionId.in(collectionIds),
				history.createdAt.between(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay())
			)
			.groupBy(groupedDate)
			.orderBy(groupedDate.asc())
			.fetch();

		return results.stream()
			.map(tuple -> {
				Date date = tuple.get(groupedDate);
				Long rawCount = tuple.get(history.count());
				int count = rawCount != null ? rawCount.intValue() : 0;
				return new HistoryContributeResponse(date, count, calculateLevel(count));
			})
			.toList();

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
