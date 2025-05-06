package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
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
}
