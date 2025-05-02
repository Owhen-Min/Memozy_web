package site.memozy.memozy_api.domain.quiz.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.global.audit.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "quizzes",
	indexes = {
		@Index(name = "idx_collection_id", columnList = "collection_id"),
		@Index(name = "idx_source_id", columnList = "source_id")
	}
)
public class Quiz extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long quizId;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String content;

	@Enumerated(EnumType.STRING)
	private QuizType type;

	@Column(nullable = false)
	private String answer;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String commentary;

	@Column(name = "quiz_option", columnDefinition = "TEXT")
	private String option;

	@Column(nullable = true)
	private Integer collectionId;

	@Column(nullable = false)
	private Integer sourceId;

	@Builder
	public Quiz(String content, QuizType type, String answer, String commentary,
		Integer collectionId, Integer sourceId, String option) {
		this.content = content;
		this.type = type;
		this.answer = answer;
		this.commentary = commentary;
		this.collectionId = collectionId;
		this.sourceId = sourceId;
		this.option = option;
	}

	public void updateCollectionId(Integer collectionId) {
		this.collectionId = collectionId;
	}
}
