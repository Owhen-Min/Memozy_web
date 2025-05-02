// dummy/analysisReportData.ts

import { AnalysisReportResponse } from "../types/analysisReport";

// 학습 참여도 데이터 생성 함수
const generateLearningContribution =
  (): AnalysisReportResponse["data"]["learningContribution"] => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const contributions = [];
    const currentDate = new Date(oneYearAgo);

    while (currentDate <= today) {
      if (Math.random() > 0.7) {
        const level = Math.floor(Math.random() * 4) + 1;
        contributions.push({
          date: currentDate.toISOString().split("T")[0],
          count: level * 2,
          level,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return contributions;
  };

export const analysisReportData: AnalysisReportResponse = {
  success: true,
  errorMsg: null,
  errorCode: null,
  data: {
    totalQuizCount: 13,
    solvedQuizCount: 6,
    learningContribution: generateLearningContribution(),
    collectionAccuracy: [
      { collectionId: "html", name: "HTML", latestAccuracy: 10 },
      { collectionId: "react", name: "React", latestAccuracy: 40 },
      { collectionId: "cs", name: "CS", latestAccuracy: 70 },
      { collectionId: "ts", name: "TypeScript", latestAccuracy: 80 },
      { collectionId: "js", name: "JavaScript", latestAccuracy: 82 },
    ],
    topCollections: [
      { collectionId: "react", name: "React", problemCount: 25 },
      { collectionId: "cs", name: "CS", problemCount: 5 },
      { collectionId: "html", name: "HTML", problemCount: 10 },
    ],
    otherCollectionsCount: 8,
  },
};
