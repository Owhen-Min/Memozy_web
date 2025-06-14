package site.memozy.memozy_api.domain.quiz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import site.memozy.memozy_api.domain.quiz.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long>, QuizRepositoryCustom {

	@Modifying
	@Query("DELETE FROM Quiz q WHERE q.sourceId = :sourceId AND q.collectionId IS NULL")
	int deleteAllBySource(Integer sourceId);

	@Query("SELECT COUNT(DISTINCT q.quizId) FROM Quiz q WHERE q.collectionId IN :collectionIds")
	long countDistinctQuiz(@Param("collectionIds") List<Integer> collectionIds);

	List<Quiz> findByQuizIdIn(List<Long> quizIds);

	void deleteByQuizIdIn(List<Long> quizIds);

	@Query("SELECT q FROM Quiz q WHERE q.sourceId IN :sourceIds AND q.collectionId IS NOT NULL")
	List<Quiz> findBySourceIdInAndCollectionIdIsNotNull(@Param("sourceIds") List<Integer> sourceIds);

	List<Quiz> findBySourceIdIn(List<Integer> sourceIds);

	List<Quiz> findBySourceId(Integer sourceId);

	@Query("SELECT COUNT(q) FROM Quiz q WHERE q.sourceId = :sourceId AND q.collectionId IS NULL")
	Long countBySource(Integer sourceId);

	@Query("SELECT q.content FROM Quiz q WHERE q.sourceId = :sourceId")
	List<String> findContentsBySourceId(Integer sourceId);

	@Query("SELECT q.quizId FROM Quiz q WHERE q.content = :content AND q.collectionId = :collectionId")
	Optional<Long> findByCollectionIdAndContent(Integer collectionId, String content);
}
