package site.memozy.memozy_api.domain.collection.entity;

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
import site.memozy.memozy_api.global.audit.BaseTimeEntityWithUpdatedAt;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "collections",
	indexes = @Index(name = "idx_user_id", columnList = "user_id")
)
public class Collection extends BaseTimeEntityWithUpdatedAt {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer collectionId;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, length = 50)
	private String code;

	@Column(nullable = false)
	private Integer userId;
}
