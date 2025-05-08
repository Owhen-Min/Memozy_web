package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import site.memozy.memozy_api.domain.collection.entity.Collection;

public interface CollectionRepository extends JpaRepository<Collection, Integer>, CollectionRepositoryCustom {
	boolean existsByUserIdAndName(Integer userId, String name);

	Optional<Collection> findByCollectionIdAndUserId(Integer collectionId, Integer userId);

	@Query("SELECT c.collectionId FROM Collection c WHERE c.userId = :userId")
	List<Integer> findCollectionIdsByUserId(Integer userId);
}
