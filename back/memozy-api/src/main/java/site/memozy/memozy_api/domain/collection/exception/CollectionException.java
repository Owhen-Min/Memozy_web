package site.memozy.memozy_api.domain.collection.exception;

public class CollectionException extends RuntimeException {
	private final CollectionError error;

	public CollectionException(CollectionError error) {
		super(error.getErrorMsg());
		this.error = error;
	}

	public CollectionError getError() {
		return error;
	}
}
