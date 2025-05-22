package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PersonalQuizAndSessionResponse {
	String collectionName;
	String quizSessionId;
	List<PersonalQuizResponse> quizList;
	int totalQuizCount;

	public static PersonalQuizAndSessionResponse of(String collectionName, String quizSessionId,
		List<PersonalQuizResponse> quizList,
		int totalQuizCount) {
		PersonalQuizAndSessionResponse response = new PersonalQuizAndSessionResponse();
		response.collectionName = collectionName;
		response.quizSessionId = quizSessionId;
		response.quizList = quizList;
		response.totalQuizCount = totalQuizCount;
		return response;
	}
}
