package site.memozy.memozy_api.domain.quizsource.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;
import site.memozy.memozy_api.global.audit.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "quiz_sources",
	indexes = {
		@Index(name = "idx_user_id", columnList = "user_id"),
		@Index(name = "idx_collection_id", columnList = "collection_id")
	}
)
public class QuizSource extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer sourceId;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String summary;

	@Column(nullable = false, length = 1024)
	private String url;

	@Column(nullable = false)
	private Integer userId;

	private Integer collectionId;

	@Builder
	public QuizSource(String title, String summary, String url, Integer userId, Integer collectionId) {
		this.title = title;
		this.summary = summary;
		this.url = url;
		this.userId = userId;
		this.collectionId = collectionId;
	}

	public static QuizSource toEntity(QuizSourceCreateRequest request, Integer userId) {
		QuizSource quizSource = new QuizSource();
		quizSource.title = request.getTitle();
		quizSource.summary = request.getContext();
		quizSource.url = request.getUrl();
		quizSource.userId = userId;

		return quizSource;
	}

	public void updateCollectionId(int collectionId) {
		this.collectionId = collectionId;
	}

	public void updateTitle(String title) {
		this.title = title;
	}
}
