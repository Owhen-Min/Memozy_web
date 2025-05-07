package site.memozy.memozy_api.domain.quiz.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.quiz.dto.PersonalQuizResponse;
import site.memozy.memozy_api.domain.quiz.repository.QuizRepository;

//TODO: 퀴즈 문제 제출 시, 유효성 검사 로직 추가하기
@Service
@RequiredArgsConstructor
public class PersonalQuizServiceImpl implements PersonalQuizService {
	private final QuizRepository quizRepository;

	@Override
	public List<PersonalQuizResponse> getPersonalQuizzes(int userId, int collectionId, int count, boolean newOnly) {
		List<PersonalQuizResponse> personalQuizzes = quizRepository.getPersonalQuizzes(userId, collectionId, count,
			newOnly);
		// 유효성 체크하고 넘기기

		return personalQuizzes;
	}
}
