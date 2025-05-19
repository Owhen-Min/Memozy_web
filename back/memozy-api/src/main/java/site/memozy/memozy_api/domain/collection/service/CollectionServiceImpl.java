package site.memozy.memozy_api.domain.collection.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

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
import site.memozy.memozy_api.domain.collection.util.TitleCleaner;
import site.memozy.memozy_api.domain.history.repository.HistoryRepository;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {
	private final CollectionRepository collectionRepository;
	private final QuizSourceRepository quizSourceRepository;
	private final QuizRepository quizRepository;
	private final HistoryRepository historyRepository;
	private final TitleCleaner titleCleaner;

	@Override
	@Transactional
	public void createCollection(Integer userId, CollectionCreateRequest request) {
		String name = request.getTitle();

		if (collectionRepository.existsByUserIdAndName(userId, name)) {
			throw new GeneralException(COLLECTION_DUPLICATE_NAME);
		}

		Collection collection = Collection.create(name, userId);
		collectionRepository.save(collection);
	}

	@Override
	@Transactional
	public void deleteCollection(Integer userId, CollectionDeleteRequest request) {
		Integer collectionId = request.getCollectionId();
		Collection collection = collectionRepository.findByCollectionIdAndUserId(collectionId, userId)
			.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));

		List<Integer> quizSourceIdList = quizSourceRepository.findByCollectionId(collectionId)
			.stream().map(QuizSource::getSourceId).toList();

		if (!quizSourceIdList.isEmpty()) {
			List<Long> quizIdList = quizRepository.findBySourceIdIn(quizSourceIdList)
				.stream().map(Quiz::getQuizId).toList();
			if (!quizIdList.isEmpty()) {
				// 1. History 삭제
				historyRepository.deleteAllByQuizIdIn(quizIdList);

				// 2. Quiz 삭제
				quizRepository.deleteByQuizIdIn(quizIdList);
			}

			// 3. QuizSource 삭제
			quizSourceRepository.deleteBySourceIdIn(quizSourceIdList);
		}

		// 4. Collection 삭제
		collectionRepository.delete(collection);
	}

	@Override
	@Transactional
	public void updateCollection(Integer userId, Integer collectionId, CollectionUpdateRequest request) {
		String newName = request.getTitle();

		Collection collection = collectionRepository.findById(collectionId)
			.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));

		if (!collection.getUserId().equals(userId)) {
			throw new GeneralException(COLLECTION_UPDATE_FORBIDDEN);
		}

		// 동일한 이름으로 수정하려고 하면 그건 인정해주기!
		if (!collection.getName().equals(newName)
			&& collectionRepository.existsByUserIdAndName(userId, newName)) {
			throw new GeneralException(COLLECTION_DUPLICATE_NAME);
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
	public CollectionSummaryResponse findCollectionByUserId(Integer userId) {
		List<Integer> sourceIds = quizSourceRepository.findSourceIdsByUserId(userId);

		List<Quiz> quizList = quizRepository.findBySourceIdInAndCollectionIdIsNotNull(sourceIds);

		return CollectionSummaryResponse.of((long)sourceIds.size(), (long)quizList.size());

	}

	@Override
	@Transactional(readOnly = true)
	public List<QuizSummaryResponse> getQuizzesByCollectionUrl(Integer userId, Integer sourceId) {
		if (!quizSourceRepository.existsBySourceIdAndUserId(sourceId, userId)) {
			throw new GeneralException(COLLECTION_INVALID_USER);
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
			throw new GeneralException(QUIZ_NOT_FOUND);
		}

		// 2. quiz들의 sourceId 목록 추출
		List<Integer> sourceIds = quizzes.stream()
			.map(Quiz::getSourceId)
			.distinct()
			.toList();

		// 3. sourceId를 통해 User 확인하기
		if (sourceIds.size() != 1) {
			throw new GeneralException(COLLECTION_TOO_MANY_SOURCE_ID);
		}
		List<Integer> distinctUserIds = quizSourceRepository.findDistinctUserIdsBySourceIds(sourceIds);
		if (distinctUserIds.size() != 1) {
			throw new GeneralException(COLLECTION_INVALID_USER);
		}
		Integer foundUserId = distinctUserIds.get(0);
		if (!foundUserId.equals(userId)) {
			throw new GeneralException(COLLECTION_INVALID_USER);
		}

		// 3. 컬렉션 ID 업데이트
		quizzes.forEach(q -> q.updateCollectionId(collectionId));

		// 4. QuizSource의 컬렉션 ID 업데이트하기
		QuizSource quizSource = quizSourceRepository.findBySourceId(sourceIds.get(0))
			.orElseThrow(() -> new GeneralException(COLLECTION_INVALID_SOURCE_ID));
		quizSource.updateCollectionId(collectionId);
	}

	@Override
	@Transactional
	public void deleteQuizzesByRequest(Integer userId, QuizDeleteRequest request) {
		if (request.hasQuizIds()) { // Quiz 삭제하기
			deleteValidQuizzes(request.getQuizId(), userId);
		} else if (request.hasSourceIds()) { // 문제 원본 삭제 + 문제 원본에 포함된 Quiz 삭제하기
			List<Integer> validSourceIds = collectionRepository.findValidSourceIdsByUser(request.getSourceId(), userId);
			// 문제 원본의 문제들 삭제하기
			List<Long> quizIds = quizRepository.findBySourceIdIn(validSourceIds).stream()
				.map(Quiz::getQuizId)
				.toList();
			deleteValidQuizzes(quizIds, userId);

			// 문제 원본들 삭제하기
			quizSourceRepository.deleteBySourceIdIn(validSourceIds);
		} else {
			throw new GeneralException(MISSING_REQUIRED_PARAMETERS);
		}
	}

	@Override
	@Transactional
	public void copyMemozies(Integer userId, Integer copyCollectionId, List<Integer> sourceIds) {
		// 1. 복사할 source들 조회
		List<QuizSource> originalSources = quizSourceRepository.findBySourceIdInAndUserId(sourceIds, userId);
		List<QuizSource> quizSourceList = collectionRepository.findExistingSourceInCollection(originalSources,
			copyCollectionId, userId);
		if (!quizSourceList.isEmpty()) {
			throw new GeneralException(COLLECTION_DUPLICATE_SOURCE);
		}

		Collection collection = collectionRepository.findByCollectionIdAndUserId(copyCollectionId, userId)
			.orElseThrow(() -> new GeneralException(COLLECTION_NOT_FOUND));
		String collectionName = collection.getName();
		for (QuizSource original : originalSources) {
			String newTitle = titleCleaner.removeCopySuffix(original.getTitle()) + "(복사본-" + collectionName + ")";
			// 2. source 복사
			QuizSource copiedSource = QuizSource.builder()
				.title(newTitle)
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
				() -> new GeneralException(COLLECTION_NOT_FOUND)
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

	@Override
	@Transactional(readOnly = true)
	public CollectionMemozyListResponse getAllMemozies(Integer userId, int page, int pageSize) {
		Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

		List<Integer> sourceIds = quizSourceRepository.findSourceIdsByUserId(userId);
		List<Quiz> quizList = quizRepository.findBySourceIdInAndCollectionIdIsNotNull(sourceIds);
		int uniqueCount = (int)quizList.stream()
			.map(this::generateQuizKey)
			.distinct()
			.count();

		List<MemozyContentResponse> content = collectionRepository.findAllWithPaging(userId, pageable);

		boolean isLast = content.size() < pageSize;

		return CollectionMemozyListResponse.builder()
			.collectionName("모두 보기")
			.content(content)
			.duplicateQuizCount(quizList.size() - uniqueCount)
			.last(isLast)
			.build();
	}

	private void deleteValidQuizzes(List<Long> quizIds, Integer userId) {
		List<Long> validQuizIds = collectionRepository.findValidQuizIdsByUser(quizIds, userId);
		if (validQuizIds.isEmpty()) {
			return;
		}

		List<Long> existingHistoryIds = historyRepository.findQuizIdByQuizIdIn(validQuizIds);

		if (!existingHistoryIds.isEmpty()) {
			historyRepository.deleteAllByQuizIdIn(existingHistoryIds);
		}

		quizRepository.deleteByQuizIdIn(validQuizIds);
	}

	private String generateQuizKey(PersonalQuizResponse response) {
		return String.join("|",
			response.getContent(),
			response.getType().name(),
			response.getAnswer(),
			response.getCommentary()
		);
	}

	private String generateQuizKey(Quiz quiz) {
		return String.join("|",
			quiz.getContent(),
			quiz.getType().name(),
			quiz.getAnswer(),
			quiz.getCommentary()
		);
	}
}
