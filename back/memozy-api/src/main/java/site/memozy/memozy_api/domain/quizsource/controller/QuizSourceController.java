package site.memozy.memozy_api.domain.quizsource.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceResponse;
import site.memozy.memozy_api.domain.quizsource.service.QuizSourceService;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Tag(name = "QuizSource", description = "QuizSource (원본데이터) 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz-source")
public class QuizSourceController {

	private final QuizSourceService quizSourceService;

	@Operation(summary = "해당 데이터 요약", description = "해당 데이터를 요약해서 마크다운 형식으로 반환")
	@PostMapping("/summary")
	public ApiResponse<String> createQuizSourceSummary(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody QuizSourceCreateRequest request) {

		String summary = quizSourceService.summarizeMarkdown(request);

		return ApiResponse.success(summary);
	}

	@Operation(summary = "해당 데이터 저장", description = "해당 데이터를 요약해서 데이터베이스에 저장")
	@PostMapping
	public ApiResponse<Integer> saveQuizSourceSummary(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody QuizSourceCreateRequest request) {

		Integer quizSourceId = quizSourceService.saveQuizSourceSummary(request, user.getUserId());

		return ApiResponse.success(quizSourceId);
	}
	
	@Operation(summary = "해당 요약 데이터 조회", description = "해당 요약 데이터를 조회")
	@GetMapping("/{sourceId}")
	public ApiResponse<QuizSourceResponse> getQuizSourceSummary(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "요약을 조회할 원본데이터 ID ", example = "1") @PathVariable Integer sourceId) {

		QuizSourceResponse quizSource = quizSourceService.getQuizSourceById(sourceId, user.getUserId());

		return ApiResponse.success(quizSource);
	}
}
