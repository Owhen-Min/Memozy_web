package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import site.memozy.memozy_api.domain.quiz.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
	List<Quiz> findByQuizIdIn(List<Long> quizIds);

	void deleteByQuizIdIn(List<Long> quizIds);

	List<Quiz> findBySourceIdIn(List<Integer> sourceIds);

	List<Quiz> findBySourceId(Integer sourceId);
	@Modifying
	@Query("DELETE FROM Quiz q WHERE q.sourceId = :sourceId AND q.collectionId IS NULL")
	int deleteAllBySource(Integer sourceId);

	@Query("SELECT COUNT(q) FROM Quiz q WHERE q.sourceId = :sourceId AND q.collectionId IS NULL")
	Long countBySource(Integer sourceId);
}
