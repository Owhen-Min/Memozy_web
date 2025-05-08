package site.memozy.memozy_api.domain.collection.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionMemozyListResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.domain.collection.dto.MemozyContentResponse;
import site.memozy.memozy_api.domain.collection.dto.QuizDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.entity.Collection;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;

// TODO: 컬렉션 삭제 시, Memozy 및 퀴즈도 삭제하는 로직 추가하기
@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {
	private final CollectionRepository collectionRepository;
	private final QuizSourceRepository quizSourceRepository;
	private final QuizRepository quizRepository;

	@Override
	@Transactional
	public void createCollection(Integer userId, CollectionCreateRequest request) {
		String name = request.getTitle();

		if (collectionRepository.existsByUserIdAndName(userId, name)) {
			throw new IllegalArgumentException("이미 같은 이름의 컬렉션이 존재합니다.");
		}

		Collection collection = Collection.create(name, userId);
		collectionRepository.save(collection);
	}

	@Override
	@Transactional
	public void deleteCollection(Integer userId, CollectionDeleteRequest request) {
		Integer collectionId = request.getCollectionId();

		Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
			.orElseThrow(() -> new IllegalArgumentException("해당 컬렉션이 존재하지 않습니다."));

		if (!collection.getUserId().equals(userId)) {
			throw new IllegalArgumentException("해당 컬렉션이 존재하지 않습니다.");
		}

		collectionRepository.delete(collection);
	}

	@Override
	@Transactional
	public void updateCollection(Integer userId, Integer collectionId, CollectionUpdateRequest request) {
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
	public List<CollectionSummaryResponse> getAllCollections(Integer userId) {
		return collectionRepository.findCollectionSummariesByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<QuizSummaryResponse> getQuizzesByCollectionUrl(Integer userId, Integer sourceId) {
		if (!quizSourceRepository.existsBySourceIdAndUserId(sourceId, userId)) {
			throw new IllegalArgumentException("해당 user가 요청할 수 없는 sourceId.");
		}

		return collectionRepository.findQuizSummariesBySourceIdAndUserId(sourceId, userId);
	}

	// NOTE: 퀴즈의 컬렉션이 NULL인지는 확인하지 않기(추후에 컬렉션 이동이 있을 경우 동일한 메소드 사용하기)
	@Override
	@Transactional
	public void addQuizzesToCollection(Integer userId, Integer collectionId, List<Long> quizIds) {
		// 1. 퀴즈 목록 조회
		List<Quiz> quizzes = quizRepository.findByQuizIdIn(quizIds);
		if (quizzes.isEmpty()) {
			throw new IllegalArgumentException("요청한 퀴즈가 존재하지 않습니다.");
		}

		// 2. quiz들의 sourceId 목록 추출
		List<Integer> sourceIds = quizzes.stream()
			.map(Quiz::getSourceId)
			.distinct()
			.toList();

		// 3. sourceId를 통해 User 확인하기
		List<Integer> distinctUserIds = quizSourceRepository.findDistinctUserIdsBySourceIds(sourceIds);
		if (distinctUserIds.size() != 1) {
			throw new RuntimeException("유저 ID가 여러 개 존재합니다.");
		}
		Integer foundUserId = distinctUserIds.get(0);
		if (!foundUserId.equals(userId)) {
			throw new RuntimeException("요청한 유저 ID와 소스 ID 목록의 유저 ID가 일치하지 않습니다.");
		}

		// 3. 컬렉션 ID 업데이트
		quizzes.forEach(q -> q.updateCollectionId(collectionId));
	}

	@Override
	@Transactional
	public void deleteQuizzesByRequest(Integer userId, QuizDeleteRequest request) {
		if (request.hasQuizIds()) { // Quiz 삭제하기
			deleteValidQuizzes(request.getQuizId(), userId);
		} else if (request.hasSourceIds()) { // 문제 원본 삭제 + 문제 원본에 포함된 Quiz 삭제하기
			// 문제 원본의 문제들 삭제하기
			List<Long> quizIds = quizRepository.findBySourceIdIn(request.getSourceId()).stream()
				.map(Quiz::getQuizId)
				.toList();
			deleteValidQuizzes(quizIds, userId);

			// 문제 원본들 삭제하기
			List<Integer> validSourceIds = collectionRepository.findValidSourceIdsByUser(request.getSourceId(), userId);
			quizSourceRepository.deleteBySourceIdIn(validSourceIds);
		} else {
			throw new IllegalArgumentException("quizId 또는 sourceId 중 하나는 필수입니다.");
		}
	}

	@Override
	@Transactional
	public void copyMemozies(Integer userId, Integer copyCollectionId, List<Integer> sourceIds) {
		// 1. 복사할 source들 조회
		List<QuizSource> originalSources = quizSourceRepository.findBySourceIdInAndUserId(sourceIds, userId);

		for (QuizSource original : originalSources) {
			// 2. source 복사
			QuizSource copiedSource = QuizSource.builder()
				.title(original.getTitle())
				.summary(original.getSummary())
				.url(original.getUrl())
				.userId(userId)
				.collectionId(copyCollectionId)
				.build();
			quizSourceRepository.save(copiedSource);

			// 3. 해당 source에 연결된 퀴즈 조회
			List<Quiz> quizzes = quizRepository.findBySourceId(original.getSourceId());

			// 4. 퀴즈 복사
			List<Quiz> copiedQuizzes = quizzes.stream()
				.map(q -> Quiz.builder()
					.content(q.getContent())
					.type(q.getType())
					.answer(q.getAnswer())
					.commentary(q.getCommentary())
					.collectionId(copyCollectionId)
					.sourceId(copiedSource.getSourceId())
					.option(q.getOption())
					.build())
				.collect(Collectors.toList());

			quizRepository.saveAll(copiedQuizzes);
		}
	}

	@Override
	@Transactional(readOnly = true)
	public CollectionMemozyListResponse getMemoziesByCollectionId(Integer userId, Integer collectionId,
		int page, int pageSize) {
		// 1. CollectionName 얻기
		Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
			.orElseThrow(
				() -> new RuntimeException("예외처리")
			);

		// 2. Pageable 생성
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

		// 3. content 조회
		List<MemozyContentResponse> content = collectionRepository.findByCollectionIdWithPaging(collectionId,
			pageable);

		// 4. 마지막 페이지 여부 계산
		boolean isLast = content.size() < pageSize;

		return CollectionMemozyListResponse.builder()
			.collectionName(collection.getName())
			.content(content)
			.last(isLast)
			.build();
	}

	private void deleteValidQuizzes(List<Long> quizIds, Integer userId) {
		List<Long> validQuizIds = collectionRepository.findValidQuizIdsByUser(quizIds, userId);
		quizRepository.deleteByQuizIdIn(validQuizIds);
	}
}
