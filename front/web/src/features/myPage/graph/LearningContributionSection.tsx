import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./calendarHeatmap.css";
import { LearningContribution } from "../../../types/analysisReport";
import { useEffect, useRef } from "react";

interface LearningContributionSectionProps {
  firstStudyDate: Date | null;
  learningContribution: LearningContribution[];
}

export default function LearningContributionSection({
  learningContribution,
}: LearningContributionSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const currentYear = today.getFullYear();

  // 지난 12개월 보기 (다음 달의 1일부터 12개월 뒤의 마지막 날까지)
  const startDate = new Date(currentYear, today.getMonth() - 11, 1); // 12개월 전(작년 해당월+1)의 1일
  const endDate = new Date(currentYear, today.getMonth() + 1, 0); // 이번 달의 마지막 날

  // 선택된 날짜 범위에 맞는 데이터만 필터링
  const filteredContributions = learningContribution.filter((contrib) => {
    const contribDate = new Date(contrib.date);
    return contribDate >= startDate && contribDate <= endDate;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md mb-6 md:mb-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-14 md:text-[18px] font-pre-semibold">학습 참여도</h3>
      </div>

      <p className="text-12 text-gray-600 mb-2 font-pre-regular">
        하루 단위 문제 풀이 기록으로, 색상 강도는 풀이 개수(0, 1-4, 5-9, 10-14, 15+)를 의미합니다.
      </p>

      <div className="overflow-x-auto scroll-x-end" ref={scrollRef}>
        <div className="min-w-[650px]">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={filteredContributions}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.level === 1) return "color-scale-1";
              if (value.level === 2) return "color-scale-2";
              if (value.level === 3) return "color-scale-3";
              if (value.level === 4) return "color-scale-4";
              return "color-empty";
            }}
            titleForValue={(value) => {
              if (!value) return "0 문제";
              const date = new Date(value.date);
              const formattedDate = `${date.getFullYear()}년 ${
                date.getMonth() + 1
              }월 ${date.getDate()}일`;
              return `${formattedDate}: ${value.count} 문제`;
            }}
          />
        </div>
      </div>

      <div className="text-10 md:text-12 text-gray-500 mt-2 flex justify-end">
        적음
        <div className="flex ml-1">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#ebedf0] mx-1" />
          <div className="w-2 h-2 md:w-3 md:h-3 bg-lightactive mx-1" />
          <div className="w-2 h-2 md:w-3 md:h-3 bg-normal mx-1" />
          <div className="w-2 h-2 md:w-3 md:h-3 bg-normalhover mx-1" />
          <div className="w-2 h-2 md:w-3 md:h-3 bg-normalactive mx-1" />
        </div>
        많음
      </div>
    </div>
  );
}
