package site.memozy.memozy_api.domain.collection.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import site.memozy.memozy_api.domain.collection.entity.Collection;

public interface CollectionRepository extends JpaRepository<Collection, Integer> {
}
