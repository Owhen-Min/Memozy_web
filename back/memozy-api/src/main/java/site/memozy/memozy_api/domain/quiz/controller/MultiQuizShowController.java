package site.memozy.memozy_api.domain.quiz.controller;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.service.MultiQuizShowServiceImpl;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MultiQuizShowController {

	private final MultiQuizShowServiceImpl multiQuizShowService;

	@MessageMapping("/quiz/show/{showId}")
	public void joinMultiQuizShow(
		@DestinationVariable String showId,
		Message<?> message,
		Principal principal
	) {
		log.info("[Controller] joinMultiQuizShow() called with showId: {}", showId);

		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		String userId = (String)accessor.getSessionAttributes().get("userId");
		String nickname = (String)accessor.getSessionAttributes().get("nickname");
		boolean isMember = (boolean)accessor.getSessionAttributes().get("isMember");

		log.info("Principal received -> {}, nickname = {}, isMember = {}", userId, nickname, isMember);

		multiQuizShowService.joinMultiQuizShow(showId, userId, nickname, isMember);
	}

	@GetMapping("/quiz/show")
	public String getMultiQuizShow() {
		return "redirect:/test.html";
	}
}
