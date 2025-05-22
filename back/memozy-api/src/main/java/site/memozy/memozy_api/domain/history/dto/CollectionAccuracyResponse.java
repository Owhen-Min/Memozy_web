package site.memozy.memozy_api.domain.history.dto;

public record CollectionAccuracyResponse(
	Integer collectionId,
	String name,
	Double latestAccuracy
) {
}
