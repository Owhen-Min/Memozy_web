package site.memozy.memozy_api.domain.collection.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionDeleteRequest {
	Integer collectionId;
}
