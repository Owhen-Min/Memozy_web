package site.memozy.memozy_api.domain.collection.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {
	private final CollectionRepository collectionRepository;

	@Override
	@Transactional
	public void createCollection(CustomOAuth2User user, CollectionCreateRequest request) {
		Integer userId = user.getUserId();
		String name = request.getTitle();

		if (collectionRepository.existsByUserIdAndName(userId, name)) {
			throw new IllegalArgumentException("이미 같은 이름의 컬렉션이 존재합니다.");
		}

		Collection collection = Collection.create(name, userId);
		collectionRepository.save(collection);
	}

	@Override
	@Transactional
	public void deleteCollection(CustomOAuth2User user, CollectionDeleteRequest request) {
		Integer userId = user.getUserId();
		Integer collectionId = request.getCollectionId();

		Collection collection = collectionRepository.findById(collectionId)
			.orElseThrow(() -> new IllegalArgumentException("해당 컬렉션이 존재하지 않습니다."));

		if (!collection.getUserId().equals(userId)) {
			throw new IllegalArgumentException("해당 컬렉션이 존재하지 않습니다.");
		}

		collectionRepository.delete(collection);
	}

	@Override
	@Transactional
	public void updateCollection(CustomOAuth2User user, Integer collectionId, CollectionUpdateRequest request) {
		Integer userId = user.getUserId();
		String newName = request.getTitle();

		Collection collection = collectionRepository.findById(collectionId)
			.orElseThrow(() -> new IllegalArgumentException("해당 컬렉션이 존재하지 않습니다."));

		if (!collection.getUserId().equals(userId)) {
			throw new IllegalArgumentException("해당 컬렉션을 수정할 권한이 없습니다.");
		}

		// 동일한 이름으로 수정하려고 하면 그건 인정해주기!
		if (!collection.getName().equals(newName)
			&& collectionRepository.existsByUserIdAndName(userId, newName)) {
			throw new IllegalArgumentException("이미 같은 이름의 컬렉션이 존재합니다.");
		}

		collection.updateName(newName);
	}

	@Override
	@Transactional(readOnly = true)
	public List<CollectionSummaryResponse> getAllCollections(CustomOAuth2User user) {
		return collectionRepository.findCollectionSummariesByUserId(user.getUserId());
	}
}
