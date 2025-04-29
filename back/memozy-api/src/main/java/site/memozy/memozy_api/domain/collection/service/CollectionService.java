package site.memozy.memozy_api.domain.collection.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.exception.CollectionError;
import site.memozy.memozy_api.domain.collection.exception.CollectionException;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;

@Service
@RequiredArgsConstructor
public class CollectionService {
	private final CollectionRepository collectionRepository;

	@Transactional
	public void test() {
		throw new CollectionException(CollectionError.USER_NOT_FOUND);
	}
}
