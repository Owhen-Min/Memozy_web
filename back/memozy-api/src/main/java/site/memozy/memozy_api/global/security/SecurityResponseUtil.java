package site.memozy.memozy_api.global.security;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;
import site.memozy.memozy_api.global.payload.ApiResponse;

public class SecurityResponseUtil {
	private static final ObjectMapper objectMapper = new ObjectMapper();

	public static void writeJsonResponse(HttpServletResponse response, ApiResponse apiResponse) throws IOException {
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String json = objectMapper.writeValueAsString(apiResponse);
		response.getWriter().write(json);
		response.getWriter().flush();
	}
}
