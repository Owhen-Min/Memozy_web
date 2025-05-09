package site.memozy.memozy_api.domain.quiz.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.QuizCreateRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizRebuildRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;
import site.memozy.memozy_api.domain.quiz.entity.Quiz;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;
import site.memozy.memozy_api.global.openai.OpenAiService;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

	private final QuizRepository quizRepository;
	private final QuizSourceRepository quizSourceRepository;
	private final OpenAiService openAiService;

	@Override
	@Transactional
	public QuizResponse createQuiz(Integer userId, Integer sourceId, QuizCreateRequest request) {
		String summary = quizSourceRepository.findSummary(sourceId, userId)
			.orElseThrow(() -> new GeneralException(QUIZ_SOURCE_NOT_FOUND));

		Long quizCount = quizRepository.countBySource(sourceId);
		if (quizCount > 0) {
			log.info("Quiz Count {}", quizCount);
			throw new GeneralException(QUIZ_ALREADY_EXISTS);
		}

		QuizResponse quizItems = openAiService.createQuiz(request.getQuizCount(), request.getQuizTypes(), summary);

		List<Quiz> entities = quizItems.content().stream()
			.map(item -> item.toEntity(sourceId))
			.toList();

		quizRepository.saveAll(entities);

		return quizItems;
	}

	@Override
	@Transactional
	public void deleteQuiz(Integer userId, Integer sourceId) {
		if (!quizSourceRepository.existsBySourceIdAndUserId(sourceId, userId)) {
			throw new GeneralException(QUIZ_SOURCE_NOT_FOUND);
		}

		int quizDeleteCount = quizRepository.deleteAllBySource(sourceId);

		log.info("사용하지 않는 Quiz 개수를 삭제하였습니다. 삭제 개수 {} ", quizDeleteCount);
	}

	@Override
	public List<QuizSelectResponse> getQuizList(Integer userId, Integer sourceId) {
		if (!quizSourceRepository.existsBySourceIdAndUserId(sourceId, userId)) {
			throw new GeneralException(QUIZ_SOURCE_NOT_FOUND);
		}

		return quizRepository.findAllQuizBySourceId(sourceId);
	}

	@Override
	@Transactional
	public List<QuizSelectResponse> rebuildQuiz(Integer userId, Integer sourceId, QuizRebuildRequest request) {
		String summary = quizSourceRepository.findSummary(sourceId, userId)
			.orElseThrow(() -> new GeneralException(QUIZ_SOURCE_NOT_FOUND));

		int deleteQuizCount = (int)quizRepository.deleteQuizNotInQuizId(request.quizIdList(), sourceId);

		if (deleteQuizCount == 0) {
			throw new GeneralException(QUIZ_ALREADY_CREATE_COUNT);
		}

		QuizResponse quizItems = openAiService.createQuiz(deleteQuizCount, request.quizTypes(), summary);

		List<Quiz> entities = quizItems.content().stream()
			.map(item -> item.toEntity(sourceId))
			.toList();

		quizRepository.saveAll(entities);

		return quizRepository.findAllQuizBySourceId(sourceId);
	}

}
