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
        // 문제 개수를 랜덤하게 생성 (0-20 사이)
        const count = Math.floor(Math.random() * 21);

        // 문제 개수에 따라 레벨 설정
        let level = 0;
        if (count === 0) level = 0;
        else if (count >= 1 && count <= 4) level = 1;
        else if (count >= 5 && count <= 9) level = 2;
        else if (count >= 10 && count <= 14) level = 3;
        else if (count >= 15) level = 4;

        contributions.push({
          date: currentDate.toISOString().split("T")[0],
          count: count,
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
      { collectionId: "html", name: "HTML", latestAccuracy: 10 },
      { collectionId: "react", name: "React", latestAccuracy: 40 },
      { collectionId: "cs", name: "CS", latestAccuracy: 70 },
      { collectionId: "html", name: "HTML", latestAccuracy: 10 },
    ],
    topCollections: [
      { collectionId: "react", name: "React", problemCount: 25 },
      { collectionId: "cs", name: "CS", problemCount: 5 },
      { collectionId: "html", name: "HTML", problemCount: 10 },
    ],
    otherCollectionsCount: 8,
  },
};
