package site.memozy.memozy_api.domain.quiz.service;

import org.springframework.transaction.annotation.Transactional;

import site.memozy.memozy_api.domain.quiz.dto.MultiQuizShowCreateResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizAnswerRequest;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

public interface MultiQuizShowService {

	@Transactional
	MultiQuizShowCreateResponse createMultiQuizShow(CustomOAuth2User user, int collectionId, int count);

	void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember);

	@Transactional
	void submitAnswer(String showId, String userId, QuizAnswerRequest request);

	@Transactional
	void changeNickname(String showId, String userId, boolean isMember, String nickname);

	@Transactional
	void saveQuizShow(String showId, Integer userId, String email);
}
