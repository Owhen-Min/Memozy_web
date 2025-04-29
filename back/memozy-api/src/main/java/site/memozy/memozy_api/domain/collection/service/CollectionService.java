package site.memozy.memozy_api.domain.collection.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;

@Service
@RequiredArgsConstructor
public class CollectionService {
	private final CollectionRepository collectionRepository;
}
