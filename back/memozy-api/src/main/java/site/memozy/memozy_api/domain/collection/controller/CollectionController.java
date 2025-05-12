package site.memozy.memozy_api.domain.collection.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.domain.collection.dto.CollectionCreateRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.CollectionMemozyListResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionSummaryResponse;
import site.memozy.memozy_api.domain.collection.dto.CollectionUpdateRequest;
import site.memozy.memozy_api.domain.collection.dto.MemozyCopyRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizDeleteRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizIdListRequest;
import site.memozy.memozy_api.domain.collection.dto.QuizSummaryResponse;
import site.memozy.memozy_api.domain.collection.service.CollectionService;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Tag(name = "Collection", description = "Collection 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/collection")
public class CollectionController {
	private final CollectionService collectionService;

	@Operation(summary = "컬렉션 생성", description = "새로운 컬렉션을 생성")
	@PostMapping
	public ApiResponse<Void> createCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody @Valid CollectionCreateRequest request) {

		collectionService.createCollection(user.getUserId(), request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 삭제", description = "컬렉션 ID를 기반으로 삭제")
	@DeleteMapping
	public ApiResponse<Void> deleteCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "삭제할 컬렉션 ID", example = "1") @RequestBody CollectionDeleteRequest request) {

		collectionService.deleteCollection(user.getUserId(), request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 수정", description = "컬렉션 ID를 기반으로 이름을 수정")
	@PatchMapping("/{collectionId}")
	public ApiResponse<Void> updateCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@Parameter(description = "수정할 컬렉션 ID", example = "1") @PathVariable Integer collectionId,
		@RequestBody @Valid CollectionUpdateRequest request) {

		collectionService.updateCollection(user.getUserId(), collectionId, request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 목록 조회", description = "현재 로그인한 사용자의 컬렉션 목록을 조회")
	@GetMapping
	public ApiResponse<List<CollectionSummaryResponse>> getAllCollections(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user) {

		List<CollectionSummaryResponse> response = collectionService.getAllCollections(user.getUserId());
		return ApiResponse.success(response);
	}

	@Operation(summary = "Memozy의 퀴즈들을 조회", description = "url_id를 기준으로 퀴즈들의 조회")
	@GetMapping("/url/{url_id}/quiz")
	public ApiResponse<List<QuizSummaryResponse>> getQuizzesByCollectionUrl(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable("url_id") Integer urlId) {

		List<QuizSummaryResponse> responses = collectionService.getQuizzesByCollectionUrl(user.getUserId(), urlId);
		return ApiResponse.success(responses);
	}

	@Operation(summary = "컬렉션에 퀴즈 추가", description = "지정된 collectionId에 사용자의 퀴즈들을 추가")
	@PostMapping("/{collectionId}/quiz")
	public ApiResponse<Void> addQuizzesToCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable("collectionId") Integer collectionId,
		@RequestBody @Valid QuizIdListRequest request
	) {
		collectionService.addQuizzesToCollection(user.getUserId(), collectionId, request.getQuizIdList());
		return ApiResponse.success();
	}

	@Operation(summary = "퀴즈 삭제", description = "요청한 quizId 또는 sourceId에 해당하는 퀴즈들을 삭제, 두 값 중 하나만 줘야함(비워주셈!)")
	@DeleteMapping("/quiz")
	public ApiResponse<Void> deleteQuizzes(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestBody @Valid QuizDeleteRequest request) {
		collectionService.deleteQuizzesByRequest(user.getUserId(), request);
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 내 memozy 복사")
	@PostMapping("/quiz/copy/{copyCollectionId}")
	public ApiResponse<Void> copyQuizzesFromCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@PathVariable Integer copyCollectionId,
		@RequestBody @Valid MemozyCopyRequest request
	) {
		collectionService.copyMemozies(user.getUserId(), copyCollectionId, request.getSourceId());
		return ApiResponse.success();
	}

	@Operation(summary = "컬렉션 내 memozy 목록 조회", description = "page는 0번 부터 순차적으로 1,2,3 늘려주면서 호출해주면 됨")
	@GetMapping("/url")
	public ApiResponse<CollectionMemozyListResponse> getUrlsInCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user,
		@RequestParam("collectionId") Integer collectionId,
		@RequestParam(value = "page", defaultValue = "0") int page,
		@RequestParam(value = "pageSize", defaultValue = "5") int pageSize
	) {
		CollectionMemozyListResponse response = collectionService.getMemoziesByCollectionId(user.getUserId(),
			collectionId, page, pageSize);
		return ApiResponse.success(response);
	}
}
