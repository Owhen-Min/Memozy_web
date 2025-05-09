package site.memozy.memozy_api.global.security;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import site.memozy.memozy_api.global.payload.ApiResponse;

@RestController
public class CorsPreflightController {
	@RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
	public ApiResponse<Void> handleOptions() {
		return ApiResponse.success();
	}
}
