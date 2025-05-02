package site.memozy.memozy_api.domain.quizsource.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;

public interface QuizSourceRepository extends JpaRepository<QuizSource, Integer> {
	boolean existsBySourceIdAndUserId(Integer sourceId, Integer userId);

	List<QuizSource> findAllBySourceIdIn(List<Integer> sourceIds);

	void deleteBySourceIdIn(List<Integer> sourceIds);

	List<QuizSource> findBySourceIdInAndUserId(List<Integer> sourceIds, Integer userId);
}
