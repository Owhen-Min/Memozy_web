package site.memozy.memozy_api.domain.quizsource.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;

public interface QuizSourceRepository extends JpaRepository<QuizSource, Integer> {
}
