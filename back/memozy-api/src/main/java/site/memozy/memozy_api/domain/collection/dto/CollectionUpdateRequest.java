package site.memozy.memozy_api.domain.collection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionUpdateRequest {
	@Size(max = 25, message = "제목은 최대 25자까지 입력 가능합니다.")
	@NotBlank(message = "제목은 비어있을 수 없습니다.")
	String title;
}
