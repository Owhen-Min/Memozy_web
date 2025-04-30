package site.memozy.memozy_api.domain.collection.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionListResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.domain.collection.service.CollectionService;
import site.memozy.memozy_api.global.auth.CustomOAuth2User;
import site.memozy.memozy_api.global.response.ApiResponse;

@Tag(name = "Collection", description = "Collection 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/collection")
public class CollectionController {
	private final CollectionService collectionService;

	@Operation(summary = "컬렉션 생성", description = "새로운 컬렉션을 생성")
	@PostMapping
	public ApiResponse<Void> createCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody @Valid CollectionCreateRequest request) {

		collectionService.createCollection(user, request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 삭제", description = "컬렉션 ID를 기반으로 삭제")
	@DeleteMapping
	public ApiResponse<Void> deleteCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "삭제할 컬렉션 ID", example = "1") @RequestBody CollectionDeleteRequest request) {

		collectionService.deleteCollection(user, request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 수정", description = "컬렉션 ID를 기반으로 이름을 수정")
	@PatchMapping("/{collectionId}")
	public ApiResponse<Void> updateCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "수정할 컬렉션 ID", example = "1") @PathVariable Integer collectionId,
		@RequestBody @Valid CollectionUpdateRequest request) {

		collectionService.updateCollection(user, collectionId, request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 목록 조회", description = "현재 로그인한 사용자의 컬렉션 목록을 조회")
	@GetMapping
	public ApiResponse<CollectionListResponse> getAllCollections(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user) {

		CollectionListResponse response = collectionService.getAllCollections(user);
		return ApiResponse.success(response);
	}
}
