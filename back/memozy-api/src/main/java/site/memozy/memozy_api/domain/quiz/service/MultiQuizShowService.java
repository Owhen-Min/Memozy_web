package site.memozy.memozy_api.domain.quiz.service;

public interface MultiQuizShowService {

	void joinMultiQuizShow(String showId, String userId, String nickname, boolean isMember);
}
