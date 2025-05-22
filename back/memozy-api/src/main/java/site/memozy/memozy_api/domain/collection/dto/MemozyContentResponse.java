package site.memozy.memozy_api.domain.collection.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemozyContentResponse {
	private int sourceId;
	private String sourceTitle;
	private String summary;
	private int quizCount;
	private String url;

	//@QueryProjection
	public MemozyContentResponse(int sourceId, String sourceTitle, String summary, int quizCount, String url) {
		this.sourceId = sourceId;
		this.sourceTitle = sourceTitle;
		this.summary = summary;
		this.quizCount = quizCount;
		this.url = url;
	}
}
