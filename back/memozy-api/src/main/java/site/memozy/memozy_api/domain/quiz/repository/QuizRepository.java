package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.quiz.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
	List<Quiz> findByQuizIdIn(List<Long> quizIds);

	void deleteByQuizIdIn(List<Long> quizIds);

	List<Quiz> findBySourceIdIn(List<Integer> sourceIds);

	List<Quiz> findBySourceId(Integer sourceId);
}
