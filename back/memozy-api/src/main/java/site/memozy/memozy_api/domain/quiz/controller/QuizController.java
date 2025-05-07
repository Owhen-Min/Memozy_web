package site.memozy.memozy_api.domain.quiz.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import groovy.util.logging.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.QuizCreateRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizSelectResponse;
import site.memozy.memozy_api.domain.quiz.service.QuizService;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Tag(name = "Quiz", description = "Quiz 관련 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
public class QuizController {

	private final QuizService quizService;

	@Operation(summary = "퀴즈 생성", description = "해당 요약 데이터를 가지고 퀴즈를 생성합니다.")
	@PostMapping("/{sourceId}")
	public ApiResponse<QuizResponse> createQuiz(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "퀴즈 만들려는 요약 데이터 Id", example = "1") @PathVariable Integer sourceId,
		@RequestBody @Valid QuizCreateRequest request) {

		QuizResponse quiz = quizService.createQuiz(user.getUserId(), sourceId, request);

		return ApiResponse.success(quiz);
	}

	@Operation(summary = "퀴즈 삭제 - 테스트 용도", description = "해당 요약 데이터에 대한 퀴즈를 삭제합니다.지금은 수동으로 삭제합니다. 나중에는 자동으로 삭제할 예정입니다.")
	@DeleteMapping("/{sourceId}")
	public ApiResponse<Void> deleteQuiz(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "퀴즈 삭제하려는 요약 데이터 Id", example = "1") @PathVariable Integer sourceId) {

		quizService.deleteQuiz(user.getUserId(), sourceId);

		return ApiResponse.success();
	}

	@Operation(summary = "퀴즈 목록 조회", description = "해당 요약 데이터에 대한 퀴즈 목록을 조회합니다.")
	@GetMapping("/{sourceId}")
	public ApiResponse<List<QuizSelectResponse>> getQuizList(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "퀴즈 목록 조회하려는 요약 데이터 Id", example = "1") @PathVariable Integer sourceId) {

		List<QuizSelectResponse> quizList = quizService.getQuizList(user.getUserId(), sourceId);

		return ApiResponse.success(quizList);
	}

}
