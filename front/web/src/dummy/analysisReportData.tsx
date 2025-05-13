import { AnalysisReportResponse } from "../types/analysisReport";

export const analysisReportData: AnalysisReportResponse = {
  success: true,
  errorMsg: null,
  errorCode: null,
  data: {
    totalQuizCount: 13,
    solvedQuizCount: 6,
    // 학습 참여도 더미 데이터 제거
    // learningContribution: generateLearningContribution(),
    learningContribution: [], // 빈 배열로 설정하여 linter 오류 수정
    collectionAccuracy: [
      { collectionId: "html", name: "HTML", latestAccuracy: 10 },
      { collectionId: "html", name: "HTML", latestAccuracy: 10 },
      { collectionId: "react", name: "React", latestAccuracy: 40 },
    ],
    topCollections: [
      { collectionId: "react", name: "React", problemCount: 25 },
      { collectionId: "cs", name: "CS", problemCount: 5 },
      { collectionId: "html", name: "HTML", problemCount: 10 },
    ],
    otherCollectionsCount: 8,
  },
};
