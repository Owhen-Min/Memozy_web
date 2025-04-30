package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QCollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QQuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.entity.QCollection;
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
}
