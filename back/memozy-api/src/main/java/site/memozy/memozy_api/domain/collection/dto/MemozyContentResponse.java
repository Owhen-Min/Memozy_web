package site.memozy.memozy_api.domain.collection.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemozyContentResponse {
	private Long urlId;
	private String urlTitle;
	private String summary;
	private int quizCount;
}
