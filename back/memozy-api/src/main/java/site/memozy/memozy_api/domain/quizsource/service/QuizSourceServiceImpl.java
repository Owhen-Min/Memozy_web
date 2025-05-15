package site.memozy.memozy_api.domain.quizsource.service;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.QUIZ_SOURCE_NOT_FOUND;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceResponse;
import site.memozy.memozy_api.domain.quizsource.entity.QuizSource;
import site.memozy.memozy_api.domain.quizsource.repository.QuizSourceRepository;
import site.memozy.memozy_api.global.openai.OpenAiService;
import site.memozy.memozy_api.global.payload.code.ErrorStatus;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizSourceServiceImpl implements QuizSourceService {

	private final OpenAiService openAiService;
	private final QuizSourceRepository quizSourceRepository;

	@Override
	public String summarizeMarkdown(QuizSourceCreateRequest request) {
		return openAiService.summarizeMarkdown(request);
	}

	@Override
	@Transactional
	public Integer saveQuizSourceSummary(QuizSourceCreateRequest request, Integer userId) {

		quizSourceRepository.findSourceIdByUrlAndUserId(request.getUrl(), userId)
			.ifPresent(quizSourceId -> {
				throw new GeneralException(ErrorStatus.QUIZ_SOURCE_EXISTS.withMessage(quizSourceId.toString()));
			});

		QuizSource quizSource = QuizSource.toEntity(request, userId);
		QuizSource saveQuizSource = quizSourceRepository.save(quizSource);

		return saveQuizSource.getSourceId();
	}

	@Override
	@Transactional(readOnly = true)
	public QuizSourceResponse getQuizSourceById(Integer sourceId, Integer userId) {
		QuizSource quizSource = quizSourceRepository.findBySourceIdAndUserId(sourceId, userId)
			.orElseThrow(() -> new GeneralException(QUIZ_SOURCE_NOT_FOUND));

		return QuizSourceResponse.of(quizSource);
	}
}

