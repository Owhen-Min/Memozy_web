import { useState, useEffect, useRef } from "react";
import { AnalysisReportData } from "../../types/analysisReport";
import {
  fetchLearningContribution,
  fetchQuizStats,
  fetchCollectionStats,
} from "../../apis/history/historyApi";
import CountQuizSection from "./graph/CountQuizSection";
import LearningContributionSection from "./graph/LearningContributionSection";
import CollectionAccuracyChart from "./graph/CollectionAccuracyChart";
import CollectionDistributionChart from "./graph/CollectionDistributionChart";

function AnalysisReport() {
  // 초기 상태를 빈 객체로 설정
  const [reportData, setReportData] = useState<AnalysisReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstStudyDate, setFirstStudyDate] = useState<Date | null>(null);
  const apiRequestMade = useRef<boolean>(false);

  useEffect(() => {
    const loadReportData = async () => {
      if (apiRequestMade.current) return;
      apiRequestMade.current = true;
      setIsLoading(true);

      try {
        // 병렬로 모든 API 요청 실행
        const [contributionData, quizStatsData, collectionStatsData] = await Promise.all([
          fetchLearningContribution(),
          fetchQuizStats(),
          fetchCollectionStats(),
        ]);

        // 첫 학습 날짜 설정
        if (contributionData.firstStudyDate) {
          setFirstStudyDate(new Date(contributionData.firstStudyDate));
        }

        // 데이터 병합하여 상태 업데이트
        setReportData((_prevData) => {
          const newData = {
            totalQuizCount: quizStatsData.totalQuizCount,
            solvedQuizCount: quizStatsData.solvedQuizCount,
            learningContribution: contributionData.learningContribution,
            collectionAccuracy: collectionStatsData.collectionAccuracyResponses,
            topCollections: collectionStatsData.quizCountAnalysisResponse.topCollections,
            otherCollectionsCount:
              collectionStatsData.quizCountAnalysisResponse.otherCollectionsCount,
          };
          return newData;
        });
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          apiRequestMade.current = false;
        }, 100);
      }
    };
    loadReportData();
  }, []);

  // 데이터 로딩 중인 경우
  if (isLoading || !reportData) {
    return null;
  }

  return (
    <div className="mb-20">
      <CountQuizSection
        totalQuizCount={reportData.totalQuizCount}
        solvedQuizCount={reportData.solvedQuizCount}
      />

      <LearningContributionSection
        firstStudyDate={firstStudyDate}
        learningContribution={reportData.learningContribution}
      />

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-1">
        <CollectionAccuracyChart collectionAccuracy={reportData.collectionAccuracy} />
        <CollectionDistributionChart
          topCollections={reportData.topCollections}
          otherCollectionsCount={reportData.otherCollectionsCount}
        />
      </div>
    </div>
  );
}

export default AnalysisReport;
