package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;

import site.memozy.memozy_api.domain.quiz.dto.MultiQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;

public interface QuizRepositoryCustom {

	List<QuizSelectResponse> findAllQuizBySourceId(Integer sourceId);

	List<PersonalQuizResponse> getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly);

	List<MultiQuizResponse> getMultiQuizzes(int userId, int collectionId, int count);

	long deleteQuizNotInQuizId(List<Long> quizIds, Integer sourceId);

}
