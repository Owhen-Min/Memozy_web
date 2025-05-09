package site.memozy.memozy_api.domain.quiz.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import groovy.util.logging.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAndSessionResponse;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResultRequest;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResultResponse;
import site.memozy.memozy_api.domain.quiz.service.PersonalQuizService;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Tag(name = "Personal Quiz Game", description = "개인 퀴즈 관련 API")
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz/personal")
public class PersonalQuizController {
	private final PersonalQuizService personalQuizService;

	@Operation(
		summary = "개인 퀴즈 생성하기",
		description = "특정 컬렉션의 개인 퀴즈 생성"
	)
	@GetMapping("/{collectionId}")
	public ApiResponse<PersonalQuizAndSessionResponse> getPersonalQuizzes(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable Integer collectionId,
		@RequestParam(defaultValue = "10") int count,
		@Parameter(description = "새로 푼 문제만 가져올지 여부 (기본값: false)", example = "false") @RequestParam(defaultValue = "false") boolean newOnly) {

		PersonalQuizAndSessionResponse responses = personalQuizService.getPersonalQuizzes(user.getUserId(),
			collectionId,
			count, newOnly);
		return ApiResponse.success(responses);
	}

	@Operation(
		summary = "퀴즈 답안 제출",
		description = "특정 퀴즈에 대한 사용자의 답안을 제출"
	)
	@PostMapping("/{quiz_id}")
	public ApiResponse<Void> submitPersonalQuiz(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable("quiz_id") Long quizId,
		@RequestBody PersonalQuizAnswerRequest request) {
		personalQuizService.submitQuizAnswer(user.getUserId(), quizId, request);
		return ApiResponse.success();
	}

	@Operation(
		summary = "퀴즈 결과 조회",
		description = "퀴즈 세션 ID를 기반으로 사용자의 개인 퀴즈 결과 조회"
	)
	@PostMapping("/result")
	public ApiResponse<PersonalQuizResultResponse> getPersonalQuizResult(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody PersonalQuizResultRequest request) {

		PersonalQuizResultResponse response = personalQuizService.getPersonalQuizResult(user.getUserId(),
			request.getQuizSessionId());
		return ApiResponse.success(response);
	}

}
