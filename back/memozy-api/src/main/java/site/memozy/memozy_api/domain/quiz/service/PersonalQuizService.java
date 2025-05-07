package site.memozy.memozy_api.domain.quiz.service;

import java.util.List;

import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;

public interface PersonalQuizService {
	List<PersonalQuizResponse> getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly);
}
