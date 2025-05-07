package site.memozy.memozy_api.domain.quizsource.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizSourceCreateRequest {

	private Integer type;

	private String title;
	//TODO: 글자수 제한 추가
	private String context;
	private String url;
}
