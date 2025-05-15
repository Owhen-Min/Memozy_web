package site.memozy.memozy_api.domain.quiz.repository;

import static site.memozy.memozy_api.domain.history.entity.QHistory.*;
import static site.memozy.memozy_api.domain.quiz.entity.QQuiz.*;
import static site.memozy.memozy_api.domain.quizsource.entity.QQuizSource.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

	// todo: 모든 데이터를 가져온 후, 중복을 제거함.(비효율적), 추후에 리팩토링
	@Override
	public List<PersonalQuizResponse> getPersonalQuizzes(int userId, Integer collectionId, int count, boolean newOnly) {
		List<Integer> quizSourceIdList = jpaQueryFactory
			.select(quizSource.sourceId)
			.from(quizSource)
			.where(
				quizSource.userId.eq(userId),
				collectionId == 0 ? null : quizSource.collectionId.eq(collectionId)
			)
			.fetch();

		List<PersonalQuizResponse> quizShowKeyList = jpaQueryFactory
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
				quiz.sourceId.in(quizSourceIdList),
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
			.fetch();

		Set<String> uniqueKeys = new HashSet<>();
		List<PersonalQuizResponse> uniqueList = quizShowKeyList.stream()
			.filter(response -> {
				String key = generateQuizKey(response);
				if (uniqueKeys.contains(key)) {
					return false;  // 이미 존재하면 스킵
				} else {
					uniqueKeys.add(key);  // 없으면 추가하고 유지
					return true;
				}
			})
			.limit(count)
			.collect(Collectors.toList());

		return uniqueList;
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

	private String generateQuizKey(PersonalQuizResponse response) {
		return String.join("|",
			response.getContent(),
			response.getType().name(),
			response.getAnswer(),
			response.getCommentary()
		);
	}
}
