package site.memozy.memozy_api.domain.quiz.controller;

import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.MultiQuizShowCreateResponse;
import site.memozy.memozy_api.domain.quiz.dto.NicknameUpdateRequest;
import site.memozy.memozy_api.domain.quiz.dto.QuizAnswerRequest;
import site.memozy.memozy_api.domain.quiz.service.MultiQuizShowRunner;
import site.memozy.memozy_api.domain.quiz.service.MultiQuizShowServiceImpl;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/quiz/show")
public class MultiQuizShowController {

	private final MultiQuizShowServiceImpl multiQuizShowService;
	private final MultiQuizShowRunner multiQuizShowRunner;

	@GetMapping("/{collectionId}")
	@ResponseBody
	public ApiResponse<MultiQuizShowCreateResponse> create(@AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable Integer collectionId, @RequestParam(defaultValue = "5") int count
	) {
		log.info("[Controller] create() called with collectionId: {}, count: {}", collectionId, count);
		return ApiResponse.success(multiQuizShowService.createMultiQuizShow(user, collectionId, count));
	}

	@MessageMapping("/quiz/show/{showId}/join")
	public void joinMultiQuizShow(@DestinationVariable String showId, Message<?> message) {
		log.info("[Controller] joinMultiQuizShow() called with showId: {}", showId);

		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		String userId = (String)accessor.getSessionAttributes().get("userId");
		String nickname = (String)accessor.getSessionAttributes().get("nickname");
		boolean isMember = (boolean)accessor.getSessionAttributes().get("isMember");

		log.info("Principal received -> {}, nickname = {}, isMember = {}", userId, nickname, isMember);

		multiQuizShowService.joinMultiQuizShow(showId, userId, nickname, isMember);
	}

	@MessageMapping("/quiz/show/{showId}/start")
	public void startMultiQuizShow(
		@DestinationVariable String showId, Message<?> message) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
		String userId = (String)accessor.getSessionAttributes().get("userId");
		log.info("[Controller] startMultiQuizShow() called with showId: {}", showId);
		multiQuizShowService.startMultiQuizShow(showId, userId);
	}

	@MessageMapping("/quiz/show/{showId}/submit")
	public void submitAnswer(@DestinationVariable String showId, @Payload QuizAnswerRequest request,
		Message<?> message) {
		log.info("[Controller] submitAnswer() called with showId: {}", showId);

		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
		String userId = (String)accessor.getSessionAttributes().get("userId");

		log.info("Answer received -> {}, {}", userId, request);
		multiQuizShowService.submitAnswer(showId, userId, request);
	}

	@MessageMapping("/quiz/show/{showId}/nickname")
	public void changeNickname(@DestinationVariable String showId, @Payload NicknameUpdateRequest request,
		Message<?> message) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
		String userId = (String)accessor.getSessionAttributes().get("userId");
		boolean isMember = (boolean)accessor.getSessionAttributes().get("isMember");

		log.info("[Controller] changeNickname() called with showId: {}, nickname : {}", showId, request.nickname());

		multiQuizShowService.changeNickname(showId, userId, isMember, request.nickname());
	}

	@GetMapping("/quiz/show")
	public String getMultiQuizShow() {
		return "redirect:/test.html";
	}
}
