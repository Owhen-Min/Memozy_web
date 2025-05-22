package site.memozy.memozy_api.domain.history.dto;

public record TopCollectionResponse(
	Integer collectionId,
	String name,
	Integer problemCount
) {
}
