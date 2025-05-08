package site.memozy.memozy_api.domain.collection.repository;

import static site.memozy.memozy_api.domain.quiz.entity.QQuiz.*;
import static site.memozy.memozy_api.domain.quizsource.entity.QQuizSource.*;

import java.util.List;


import com.querydsl.core.types.Projections;
import org.springframework.data.domain.Pageable;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.MemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QCollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.collection.dto.QMemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QQuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.entity.QCollection;
import site.memozy.memozy_api.domain.history.entity.QHistory;
import site.memozy.memozy_api.domain.quiz.entity.QQuiz;
import site.memozy.memozy_api.domain.quizsource.entity.QQuizSource;

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
				quiz.count().intValue() // 각 quizSource에 묶인 quiz 개수
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
	public long countByCollectionId(Integer collectionId) {
		return queryFactory
			.select(quizSource.count())
			.from(quizSource)
			.where(quizSource.collectionId.eq(collectionId))
			.fetchOne();
	}
}
