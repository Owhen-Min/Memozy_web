package site.memozy.memozy_api.domain.collection.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.collection.entity.Collection;

public interface CollectionRepository extends JpaRepository<Collection, Integer>, CollectionRepositoryCustom {
	boolean existsByUserIdAndName(Integer userId, String name);

	List<Collection> findAllByUserId(Integer userId);

}
