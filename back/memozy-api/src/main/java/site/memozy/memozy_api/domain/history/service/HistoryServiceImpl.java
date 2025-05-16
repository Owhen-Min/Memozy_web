package site.memozy.memozy_api.domain.history.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.collection.repository.CollectionRepository;
import site.memozy.memozy_api.domain.history.dto.CollectionAccuracyResponse;
import site.memozy.memozy_api.domain.history.dto.HistoryCollectionStatsResponse;
import site.memozy.memozy_api.domain.history.dto.LearningContributionResponse;
import site.memozy.memozy_api.domain.history.dto.QuizCountAnalysisResponse;
import site.memozy.memozy_api.domain.history.dto.QuizStatsResponse;
import site.memozy.memozy_api.domain.history.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.history.entity.CollectionHistoryDetailResponse;
import site.memozy.memozy_api.domain.history.repository.HistoryRepository;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

	private final HistoryRepository historyRepository;
	private final CollectionRepository collectionRepository;
	private final QuizRepository quizRepository;
	private final QuizSourceRepository quizSourceRepository;

	@Override
	@Transactional(readOnly = true)
	public LearningContributionResponse getUserStreaks(Integer userId, String userEmail) {

		List<Integer> collectionIds = collectionRepository.findCollectionIdsByUserId(userId);

		return historyRepository.findTotalContributionsByUserEmailAndCollectionIds(collectionIds, userEmail);
	}

	@Override
	@Transactional(readOnly = true)
	public QuizStatsResponse getUserQuizStats(Integer userId, String email) {
		List<Integer> collectionIds = collectionRepository.findCollectionIdsByUserId(userId);

		//long totalQuiz = quizRepository.countDistinctQuiz(collectionIds);

		// 학준
		List<Integer> sourceIds = quizSourceRepository.findSourceIdsByUserId(userId);
		long totalQuiz = quizRepository.findBySourceIdIn(sourceIds).stream()
			.map(this::generateQuizKey)
			.distinct()
			.count();
		long solvedQuiz = historyRepository.countDistinctSolvedQuiz(collectionIds, email);

		return new QuizStatsResponse(totalQuiz, solvedQuiz);
	}

	@Override
	@Transactional(readOnly = true)
	public List<UnsolvedCollectionDtoResponse> getUnsolvedCollections(Integer userId) {
		return collectionRepository.findUnsolvedCollectionsByUserId(userId);
	}

	@Override
	@Transactional(readOnly = true)
	public HistoryCollectionStatsResponse getCollectionAccuracy(Integer userId) {
		List<Integer> collectionIds = collectionRepository.findCollectionIdsByUserId(userId);

		//추가로 넣어야함
		List<CollectionAccuracyResponse> accuracyByCollectionIds = collectionRepository.findAccuracyByCollectionIds(
			collectionIds);

		QuizCountAnalysisResponse topQuizCollectionsByIds = collectionRepository.getTopQuizCollectionsByIds(
			collectionIds);

		return new HistoryCollectionStatsResponse(accuracyByCollectionIds, topQuizCollectionsByIds);
	}

	@Override
	@Transactional(readOnly = true)
	public List<CollectionHistoryDetailResponse> getCollectionHistoryDetail(Integer userId, Integer collectionId) {

		if (!collectionRepository.existsByUserIdAndCollectionId(userId, collectionId)) {
			throw new GeneralException(COLLECTION_NOT_FOUND);
		}

		return collectionRepository.findCollectionHistoryWithQuizzes(collectionId);
	}

	@Override
	public List<CollectionHistoryDetailResponse> findAllHistoryWithQuizzes(String userEmail) {
		return collectionRepository.findAllHistoryWithQuizzes(userEmail);
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
