package site.memozy.memozy_api.global.swagger;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class SwaggerConfig {
	@Bean
	public OpenAPI customOpenAPI() {
		return new OpenAPI()
			// accessToken을 헤더에 담아 사용
			.components(new Components()
				.addSecuritySchemes("Authorization", new SecurityScheme()
					.type(SecurityScheme.Type.HTTP)
					.scheme("bearer")                             // bearer 명시
					.bearerFormat("JWT")                          // JWT 포맷 명시 (Swagger 문서 설명용)
					.in(SecurityScheme.In.HEADER)                 // HEADER 그대로 유지
					.name("Authorization")                        // Authorization 헤더
				)
			)
			.security(List.of(new SecurityRequirement().addList("Authorization")))
			.info(new Info()
				.title("Memozy API")
				.version("1.0.0")
				.description("This is the API documentation for our project!"));
	}
}
