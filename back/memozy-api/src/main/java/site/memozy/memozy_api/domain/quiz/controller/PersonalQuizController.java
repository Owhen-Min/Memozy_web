package site.memozy.memozy_api.domain.quiz.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import groovy.util.logging.Slf4j;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
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

	@GetMapping("/{collectionId}")
	public ApiResponse<List<PersonalQuizResponse>> getPersonalQuizzes(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable Integer collectionId,
		@RequestParam(defaultValue = "10") int count,
		@RequestParam(defaultValue = "false") boolean newOnly) {

		List<PersonalQuizResponse> responses = personalQuizService.getPersonalQuizzes(user.getUserId(), collectionId,
			count, newOnly);
		return ApiResponse.success(responses);
	}
}
