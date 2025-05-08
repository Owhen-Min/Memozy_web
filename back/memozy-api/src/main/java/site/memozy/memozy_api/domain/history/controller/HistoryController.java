package site.memozy.memozy_api.domain.history.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.history.dto.HistoryCollectionStatsResponse;
import site.memozy.memozy_api.domain.history.dto.HistoryContributeResponse;
import site.memozy.memozy_api.domain.history.dto.QuizStatsResponse;
import site.memozy.memozy_api.domain.history.dto.UnsolvedCollectionDtoResponse;
import site.memozy.memozy_api.domain.history.entity.CollectionHistoryDetailResponse;
import site.memozy.memozy_api.domain.history.service.HistoryService;
import site.memozy.memozy_api.global.payload.ApiResponse;
import site.memozy.memozy_api.global.security.auth.CustomOAuth2User;

@Tag(name = "History", description = "퀴즈 히스토리 관련 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class HistoryController {

	private final HistoryService historyService;

	@Operation(summary = "학습 참여도 조회", description = "년도별 학습 참여도를 조회할 수 있습니다.")
	@GetMapping("/streaks")
	public ApiResponse<List<HistoryContributeResponse>> getHistory(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
		@Parameter(description = "조회할 년도, 입력하지 않으면 최근 12개월") @RequestParam(value = "year", required = false) Integer year
	) {
		List<HistoryContributeResponse> history = historyService.getUserStreaks(customOAuth2User.getUserId(), year);
		return ApiResponse.success(history);
	}

	@Operation(summary = "개인 퀴즈 통계 조회", description = "퀴즈 통계를 조회할 수 있습니다.")
	@GetMapping("/quiz/stats")
	public ApiResponse<QuizStatsResponse> getUserQuizStats(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

		QuizStatsResponse quizStats = historyService.getUserQuizStats(customOAuth2User.getUserId());

		return ApiResponse.success(quizStats);
	}

	@Operation(summary = "오답 기록이 있는 컬렉션 리스트 반환", description = "오답 기록이 있는 컬렉션 리스트를 반환합니다.")
	@GetMapping("/collection")
	public ApiResponse<List<UnsolvedCollectionDtoResponse>> getHistoryCollection(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

		List<UnsolvedCollectionDtoResponse> history = historyService.getUnsolvedCollections(
			customOAuth2User.getUserId());

		return ApiResponse.success(history);
	}

	@Operation(summary = "컬렉션 통계 조회", description = "컬렉션 통계를 조회할 수 있습니다.")
	@GetMapping("/collection/stats")
	public ApiResponse<HistoryCollectionStatsResponse> getCollectionAccuracy(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

		HistoryCollectionStatsResponse collectionAccuracy = historyService.getCollectionAccuracy(
			customOAuth2User.getUserId());

		return ApiResponse.success(collectionAccuracy);
	}

	@Operation(summary = "컬렉션 상세 조회", description = "컬렉션 상세 조회")
	@GetMapping("/collection/{collectionId}")
	public ApiResponse<List<CollectionHistoryDetailResponse>> getCollectionHistoryDetail(
		@Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
		@Parameter(description = "컬렉션 ID") @PathVariable(value = "collectionId") Integer collectionId
	) {

		List<CollectionHistoryDetailResponse> collectionHistoryDetail = historyService
			.getCollectionHistoryDetail(customOAuth2User.getUserId(), collectionId);

		return ApiResponse.success(collectionHistoryDetail);
	}

}
