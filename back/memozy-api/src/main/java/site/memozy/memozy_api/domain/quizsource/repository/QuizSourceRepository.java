package site.memozy.memozy_api.domain.quizsource.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;

public interface QuizSourceRepository extends JpaRepository<QuizSource, Integer> {

	boolean existsByUrlAndUserId(String url, Integer userId);

	Optional<QuizSource> findBySourceIdAndUserId(Integer sourceId, Integer userId);
}
