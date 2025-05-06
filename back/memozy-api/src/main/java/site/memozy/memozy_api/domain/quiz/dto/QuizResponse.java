package site.memozy.memozy_api.domain.quiz.dto;

import java.util.List;

public record QuizResponse(int type, List<QuizItemResponse> content) {
}
