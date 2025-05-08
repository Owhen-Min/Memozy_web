package site.memozy.memozy_api.domain.history.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.history.entity.History;

public interface HistoryRepository extends JpaRepository<History, Integer>, HistoryCustomRepository {
}
