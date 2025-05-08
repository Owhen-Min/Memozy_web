package site.memozy.memozy_api.domain.collection.dto;

public record CollectionAccuracyResponse(
	Integer collectionId,
	String name,
	Double latestAccuracy
) {
}
