package site.memozy.memozy_api.domain.quiz.repository;

import static site.memozy.memozy_api.domain.history.entity.QHistory.*;
import static site.memozy.memozy_api.domain.quiz.entity.QQuiz.*;
import static site.memozy.memozy_api.domain.quizsource.entity.QQuizSource.*;

import java.util.ArrayList;
import java.util.List;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QMultiQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QPersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QQuizSelectResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;
import site.memozy.memozy_api.domain.quiz.entity.QQuiz;

@RequiredArgsConstructor
public class QuizRepositoryCustomImpl implements QuizRepositoryCustom {

	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<QuizSelectResponse> findAllQuizBySourceId(Integer sourceId) {
		QQuiz quiz = QQuiz.quiz;

		return jpaQueryFactory
			.select(new QQuizSelectResponse(
				quiz.quizId,
				quiz.type,
				quiz.content
			))
			.from(quiz)
			.where(quiz.sourceId.eq(sourceId))
			.fetch();
	}

	@Override
	public List<PersonalQuizResponse> getPersonalQuizzes(int userId, Integer collectionId, int count, boolean newOnly) {
		// 1. QuizSource 유효성 검사
		List<Integer> sourceIds = jpaQueryFactory
			.select(quizSource.sourceId)
			.from(quizSource)
			.where(
				// 1단계: URL 별 최소 sourceId 필터링
				quizSource.sourceId.in(
					jpaQueryFactory
						.select(quizSource.sourceId.min())
						.from(quizSource)
						.where(
							quizSource.userId.eq(userId),
							collectionId != 0 ? quizSource.collectionId.eq(collectionId) : null // collectionId 체크 추가
						)
						.groupBy(quizSource.url)
				)
			)
			.orderBy(quizSource.createdAt.desc())
			.fetch();

		if (sourceIds == null || sourceIds.isEmpty()) {
			return new ArrayList<>();
		}

		// 2. 랜덤 퀴즈 조회
		return jpaQueryFactory
			.select(new QPersonalQuizResponse(
				quiz.quizId,
				quiz.content,
				quiz.type,
				quiz.option,
				quiz.answer,
				quiz.commentary
			))
			.from(quiz)
			.where(
				quiz.sourceId.in(sourceIds),
				newOnly ? quiz.quizId.notIn(
					JPAExpressions
						.select(history.quizId)
						.from(history)
						.where(
							history.collectionId.eq(collectionId),
							history.quizId.isNotNull()
						)
				) : null // newOnly가 false일 때는 조건 생략
			)
			.orderBy(Expressions.numberTemplate(Double.class, "RAND()").asc())
			.limit(count)
			.fetch();
	}

	@Override
	public List<MultiQuizResponse> getMultiQuizzes(int userId, int collectionId, int count) {
		List<Integer> sourceIds = jpaQueryFactory
			.select(quizSource.sourceId)
			.from(quizSource)
			.where(
				quizSource.collectionId.eq(collectionId),
				quizSource.userId.eq(userId)
			)
			.fetch();

		// 2. 랜덤 퀴즈 조회
		return jpaQueryFactory
			.select(new QMultiQuizResponse(
				quiz.quizId,
				quiz.content,
				quiz.type,
				quiz.answer,
				quiz.commentary,
				quiz.option
			))
			.from(quiz)
			.where(
				quiz.sourceId.in(sourceIds)
			)
			.orderBy(Expressions.numberTemplate(Double.class, "RAND()").asc()) // 랜덤 정렬
			.limit(count)
			.fetch();
	}

	@Override
	public long deleteQuizNotInQuizId(List<Long> quizIds, Integer sourceId) {
		QQuiz quiz = QQuiz.quiz;
		return jpaQueryFactory.delete(quiz)
			.where(quiz.sourceId.eq(sourceId)
				.and(quiz.quizId.notIn(quizIds)))
			.execute();
	}
}
