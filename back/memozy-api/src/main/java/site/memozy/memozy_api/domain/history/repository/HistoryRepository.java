package site.memozy.memozy_api.domain.history.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import site.memozy.memozy_api.domain.history.entity.History;

public interface HistoryRepository extends JpaRepository<History, Integer>, HistoryCustomRepository {

	@Query("SELECT COUNT(DISTINCT h.quizId) FROM History h WHERE h.collectionId IN :collectionIds")
	long countDistinctSolvedQuiz(@Param("collectionIds") List<Integer> collectionIds);

	@Query("""
			SELECT MAX(h.round)
			FROM History h
			WHERE h.collectionId = :collectionId
			AND (:email IS NULL OR h.email = :email)
		""")
	Optional<Integer> findMaxHistoryIdByCollectionId(@Param("collectionId") Integer collectionId,
		@Param("email") String email);

	List<History> findByCollectionIdAndRound(Integer collectionId, Integer round);
	
	void deleteAllByQuizIdIn(List<Long> quizIds);
}
