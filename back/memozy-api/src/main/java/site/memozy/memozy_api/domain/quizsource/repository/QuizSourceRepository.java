package site.memozy.memozy_api.domain.quizsource.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.lettuce.core.dynamic.annotation.Param;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;

public interface QuizSourceRepository extends JpaRepository<QuizSource, Integer> {

	List<QuizSource> findAllBySourceIdIn(List<Integer> sourceIds);

	void deleteBySourceIdIn(List<Integer> sourceIds);

	List<QuizSource> findBySourceIdInAndUserId(List<Integer> sourceIds, Integer userId);

	boolean existsByUrlAndUserId(String url, Integer userId);

	Optional<QuizSource> findBySourceIdAndUserId(Integer sourceId, Integer userId);

	@Query("SELECT q.summary FROM QuizSource q WHERE q.sourceId = :sourceId AND q.userId = :userId")
	Optional<String> findSummary(Integer sourceId, Integer userId);

	boolean existsBySourceIdAndUserId(Integer sourceId, Integer userId);

	@Query("SELECT DISTINCT q.userId FROM QuizSource q WHERE q.sourceId IN :sourceIds")
	List<Integer> findDistinctUserIdsBySourceIds(@Param("sourceIds") List<Integer> sourceIds);
}
