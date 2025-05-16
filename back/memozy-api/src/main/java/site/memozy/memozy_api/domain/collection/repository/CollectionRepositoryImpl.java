package site.memozy.memozy_api.domain.collection.repository;

import static site.memozy.memozy_api.domain.quiz.entity.QQuiz.*;
import static site.memozy.memozy_api.domain.quizsource.entity.QQuizSource.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.MemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QCollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QMemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QQuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.entity.QCollection;
import site.memozy.memozy_api.domain.history.dto.CollectionAccuracyResponse;
import site.memozy.memozy_api.domain.history.dto.QuizCountAnalysisResponse;
import site.memozy.memozy_api.domain.history.dto.TopCollectionResponse;
import site.memozy.memozy_api.domain.history.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.history.entity.CollectionHistoryDetailResponse;
import site.memozy.memozy_api.domain.history.entity.History;
import site.memozy.memozy_api.domain.history.entity.QHistory;
import site.memozy.memozy_api.domain.history.entity.QuizDetailResponse;
import site.memozy.memozy_api.domain.quiz.entity.QQuiz;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.entity.QuizType;
import site.memozy.memozy_api.domain.quizsource.entity.QQuizSource;

@Slf4j
@RequiredArgsConstructor
public class CollectionRepositoryImpl implements CollectionRepositoryCustom {
	private final JPAQueryFactory queryFactory;

	@Override
	public List<CollectionSummaryResponse> findCollectionSummariesByUserId(Integer userId) {
		QCollection collection = QCollection.collection;
		QQuiz quiz = QQuiz.quiz;
		QQuizSource quizSource = QQuizSource.quizSource;

		return queryFactory
			.select(new QCollectionSummaryResponse(
				collection.collectionId,
				collection.name,
				// quiz count
				JPAExpressions.select(quiz.count())
					.from(quiz)
					.where(quiz.collectionId.eq(collection.collectionId)),
				// source(memozy) count
				JPAExpressions.select(quizSource.count())
					.from(quizSource)
					.where(quizSource.collectionId.eq(collection.collectionId))
			))
			.from(collection)
			.where(collection.userId.eq(userId))
			.fetch();
	}

	@Override
	public List<UnsolvedCollectionDtoResponse> findUnsolvedCollectionsByUserId(Integer userId) {
		QCollection collection = QCollection.collection;
		QHistory history = QHistory.history;

		return queryFactory
			.select(Projections.constructor(UnsolvedCollectionDtoResponse.class,
				collection.collectionId,
				collection.name
			))
			.from(collection)
			.where(
				collection.userId.eq(userId),
				JPAExpressions.selectOne()
					.from(history)
					.where(
						history.collectionId.eq(collection.collectionId),
						history.isSolved.isFalse()
					)
					.exists()
			)
			.fetch();
	}

	public List<QuizSummaryResponse> findQuizSummariesBySourceIdAndUserId(Integer sourceId, Integer userId) {
		QQuiz quiz = QQuiz.quiz;

		return queryFactory
			.select(new QQuizSummaryResponse(
				quiz.quizId,
				quiz.content,
				quiz.type
			))
			.from(quiz)
			.where(quiz.sourceId.eq(sourceId))
			.fetch();
	}

	@Override
	public List<Long> findValidQuizIdsByUser(List<Long> requestedQuizIds, Integer currentUserId) {
		QQuiz quiz = QQuiz.quiz;
		QQuizSource quizSource = QQuizSource.quizSource;

		return queryFactory
			.select(quiz.quizId)
			.from(quiz)
			.join(quizSource).on(quiz.sourceId.eq(quizSource.sourceId))
			.where(
				quiz.quizId.in(requestedQuizIds),
				quizSource.userId.eq(currentUserId)
			)
			.fetch();
	}

	@Override
	public List<Integer> findValidSourceIdsByUser(List<Integer> requestedSourceIds, Integer currentUserId) {
		QQuizSource quizSource = QQuizSource.quizSource;

		return queryFactory
			.select(quizSource.sourceId)
			.from(quizSource)
			.where(
				quizSource.sourceId.in(requestedSourceIds),
				quizSource.userId.eq(currentUserId)
			)
			.fetch();
	}

	@Override
	public List<MemozyContentResponse> findByCollectionIdWithPaging(Integer collectionId, Pageable pageable) {
		return queryFactory
			.select(new QMemozyContentResponse(
				quizSource.sourceId,
				quizSource.title,
				quizSource.summary,
				quiz.count().intValue(), // 각 quizSource에 묶인 quiz 개수
				quizSource.url
			))
			.from(quizSource)
			.leftJoin(quiz).on(quiz.sourceId.eq(quizSource.sourceId))
			.where(quizSource.collectionId.eq(collectionId))
			.groupBy(quizSource.sourceId)
			.orderBy(quizSource.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();
	}

	@Override
	public List<MemozyContentResponse> findAllWithPaging(Integer userId, Pageable pageable) {
		// 1. sourceId 목록 조회(동일한 메모지는 제거한 버전)
		// List<Integer> sourceIds = queryFactory
		// 	.select(quizSource.sourceId)
		// 	.from(quizSource)
		// 	.where(quizSource.sourceId.in(
		// 		queryFactory
		// 			.select(quizSource.sourceId.min())
		// 			.from(quizSource)
		// 			.where(quizSource.userId.eq(userId),
		// 				quizSource.collectionId.isNotNull())
		// 			.groupBy(quizSource.url)
		// 	))
		// 	.orderBy(quizSource.createdAt.desc())
		// 	.offset(pageable.getOffset())
		// 	.limit(pageable.getPageSize())
		// 	.fetch();

		// 1. sourceId 목록 조회(동일한 메모지도 보여주도록)
		List<Integer> sourceIds = queryFactory
			.select(quizSource.sourceId)
			.from(quizSource)
			.where(
				quizSource.userId.eq(userId),
				quizSource.collectionId.isNotNull()  // collectionId가 null이 아닌 경우만
			)
			.orderBy(quizSource.createdAt.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		// 2. sourceId를 통해 상세 정보 조회
		return queryFactory
			.select(new QMemozyContentResponse(
				quizSource.sourceId,
				quizSource.title,
				quizSource.summary,
				quiz.count().intValue(),
				quizSource.url
			))
			.from(quizSource)
			.leftJoin(quiz).on(quiz.sourceId.eq(quizSource.sourceId))
			.where(quizSource.sourceId.in(sourceIds))
			.groupBy(quizSource.sourceId)
			.orderBy(quizSource.createdAt.desc())
			.fetch();
	}

	@Override
	public Long countByCollectionId(Integer collectionId) {
		return queryFactory
			.select(quizSource.count())
			.from(quizSource)
			.where(quizSource.collectionId.eq(collectionId))
			.fetchOne();
	}

	@Override
	public List<CollectionAccuracyResponse> findAccuracyByCollectionIds(List<Integer> collectionIds) {
		QHistory history = QHistory.history;
		QCollection collection = QCollection.collection;

		List<Tuple> latestRounds = queryFactory
			.select(history.collectionId, history.round.max())
			.from(history)
			.where(history.collectionId.in(collectionIds))
			.groupBy(history.collectionId)
			.fetch();

		List<CollectionAccuracyResponse> result = new ArrayList<>();
		for (Tuple tuple : latestRounds) {
			Integer collectionId = tuple.get(history.collectionId);
			Integer latestRound = tuple.get(history.round.max());

			Double accuracy = queryFactory
				.select(history.isSolved
					.when(true).then(1)
					.otherwise(0)
					.avg()
					.multiply(100)
				)
				.from(history)
				.where(
					history.collectionId.eq(collectionId),
					history.round.eq(latestRound)
				)
				.fetchOne();

			String name = queryFactory
				.select(collection.name)
				.from(collection)
				.where(collection.collectionId.eq(collectionId))
				.fetchOne();

			result.add(new CollectionAccuracyResponse(collectionId, name, accuracy));
		}

		return result;
	}

	@Override
	public QuizCountAnalysisResponse getTopQuizCollectionsByIds(List<Integer> collectionIds) {
		QCollection collection = QCollection.collection;

		if (collectionIds.isEmpty()) {
			return new QuizCountAnalysisResponse(List.of(), 0);
		}

		List<Tuple> allCounts = queryFactory
			.select(quiz.collectionId, quiz.count())
			.from(quiz)
			.where(quiz.collectionId.in(collectionIds))
			.groupBy(quiz.collectionId)
			.fetch();

		List<TopCollectionResponse> top3 = new ArrayList<>();
		int otherCount = 0;

		allCounts.sort((a, b) -> Long.compare(b.get(quiz.count()), a.get(quiz.count())));

		for (int i = 0; i < allCounts.size(); i++) {
			Integer colId = allCounts.get(i).get(quiz.collectionId);
			Integer count = allCounts.get(i).get(quiz.count()).intValue();

			String name = queryFactory
				.select(collection.name)
				.from(collection)
				.where(collection.collectionId.eq(colId))
				.fetchOne();

			if (i < 3) {
				top3.add(new TopCollectionResponse(colId, name, count));
			} else {
				otherCount += count;
			}
		}

		return new QuizCountAnalysisResponse(top3, otherCount);
	}

	@Override
	public List<CollectionHistoryDetailResponse> findCollectionHistoryWithQuizzes(Integer collectionId) {
		QHistory history = QHistory.history;
		QQuiz quiz = QQuiz.quiz;

		List<Integer> rounds = queryFactory
			.select(history.round)
			.from(history)
			.where(
				history.collectionId.eq(collectionId),
				history.isSolved.eq(false)
			)
			.groupBy(history.round)
			.orderBy(history.round.desc())
			.fetch();

		List<CollectionHistoryDetailResponse> result = new ArrayList<>();

		for (Integer round : rounds) {
			List<Tuple> tuples = queryFactory
				.select(history, quiz)
				.from(history)
				.join(quiz).on(history.quizId.eq(quiz.quizId))
				.where(
					history.collectionId.eq(collectionId),
					history.round.eq(round),
					history.isSolved.eq(false)
				)
				.fetch();

			List<QuizDetailResponse> quizList = tuples.stream().map(tuple -> {
				History h = tuple.get(history);
				Quiz q = tuple.get(quiz);
				return new QuizDetailResponse(
					q.getQuizId(),
					q.getContent(),
					q.getType().name(),
					h.getUserSelect(),
					(q.getType() == QuizType.MULTIPLE_CHOICE && q.getOption() != null)
						? List.of(q.getOption().split("№"))
						: null,
					q.getAnswer(),
					q.getCommentary()
				);
			}).toList();

			History anyHistory = tuples.get(0).get(history);
			int failCount = (int)tuples.stream().filter(t -> !t.get(history).getIsSolved()).count();

			result.add(new CollectionHistoryDetailResponse(
				anyHistory.getHistoryId(),
				round,
				failCount,
				anyHistory.getCreatedAt().toLocalDate().toString(),
				quizList
			));
		}

		return result;
	}

	public List<CollectionHistoryDetailResponse> findAllHistoryWithQuizzes(String userEmail) {
		QHistory history = QHistory.history;
		QQuiz quiz = QQuiz.quiz;

		List<Integer> rounds = queryFactory
			.select(history.round)
			.from(history)
			.where(
				history.collectionId.eq(0),
				history.email.eq((userEmail)),
				history.isSolved.eq(false)
			)
			.groupBy(history.round)
			.orderBy(history.round.desc())
			.fetch();

		List<CollectionHistoryDetailResponse> result = new ArrayList<>();

		for (Integer round : rounds) {
			List<Tuple> tuples = queryFactory
				.select(history, quiz)
				.from(history)
				.join(quiz).on(history.quizId.eq(quiz.quizId))
				.where(
					history.collectionId.eq(0),
					history.round.eq(round),
					history.isSolved.eq(false),
					history.email.eq(userEmail)
				)
				.fetch();

			List<QuizDetailResponse> quizList = tuples.stream().map(tuple -> {
				History h = tuple.get(history);
				Quiz q = tuple.get(quiz);
				return new QuizDetailResponse(
					q.getQuizId(),
					q.getContent(),
					q.getType().name(),
					h.getUserSelect(),
					(q.getType() == QuizType.MULTIPLE_CHOICE && q.getOption() != null)
						? List.of(q.getOption().split("№"))
						: null,
					q.getAnswer(),
					q.getCommentary()
				);
			}).toList();

			History anyHistory = tuples.get(0).get(history);
			int failCount = (int)tuples.stream().filter(t -> !t.get(history).getIsSolved()).count();

			result.add(new CollectionHistoryDetailResponse(
				anyHistory.getHistoryId(),
				round,
				failCount,
				anyHistory.getCreatedAt().toLocalDate().toString(),
				quizList
			));
		}
		return result;
	}
}
