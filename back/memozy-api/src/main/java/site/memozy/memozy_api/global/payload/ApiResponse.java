package site.memozy.memozy_api.global.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ApiResponse<T> {
	private boolean success;
	private String errorMsg;
	private String errorCode;
	private T data;

	public static <T> ApiResponse<T> success(T data) {
		return new ApiResponse<>(true, null, null, data);
	}

	public static <T> ApiResponse<T> success() {
		return new ApiResponse<>(true, null, null, null);
	}

	public static <T> ApiResponse<T> error(String errorCode, String errorMsg) {
		return new ApiResponse<>(false, errorMsg, errorCode, null);
	}
}
