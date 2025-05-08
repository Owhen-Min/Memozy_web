package site.memozy.memozy_api.domain.history.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import site.memozy.memozy_api.global.audit.BaseTimeEntity;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "histories",
	indexes = {
		@Index(name = "idx_collection_id", columnList = "collection_id"),
		@Index(name = "idx_quiz_id", columnList = "quiz_id")
	}
)
public class History extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer historyId;

	@Column(nullable = false)
	private Boolean isSolved;

	@Column(nullable = false)
	private String userSelect;

	@Column(nullable = false)
	private Long quizId;

	@Column(nullable = false)
	private Integer collectionId;
}
