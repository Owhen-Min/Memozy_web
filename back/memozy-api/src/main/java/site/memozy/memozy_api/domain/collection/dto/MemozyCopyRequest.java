package site.memozy.memozy_api.domain.collection.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemozyCopyRequest {
	@NotEmpty
	private List<Integer> sourceId;
}
