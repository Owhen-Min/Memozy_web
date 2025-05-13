import { useState, useEffect, useRef } from "react";
import small_logo from "../../assets/images/small_logo.png";
import { analysisReportData } from "../../dummy/analysisReportData";
import { AnalysisReportData } from "../../types/analysisReport";
import bookicon from "../../assets/icons/book.svg";
import openbookicon from "../../assets/icons/openbook.svg";
import { fetchLearningContribution, fetchQuizStats } from "../../apis/history/historyApi";

// 학습 참여도 캘린더 히트맵을 위한 라이브러리
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./calendarHeatmap.css";

// 차트 라이브러리
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// ChartJS 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AnalysisReport() {
  const [reportData, setReportData] = useState<AnalysisReportData | null>(analysisReportData.data);
  const apiRequestMade = useRef<boolean>(false);

  // 현재 날짜 정보
  const today = new Date();
  const currentYear = today.getFullYear();

  // 연도 목록 생성 (현재 연도부터 지난 2개년까지)
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // "지난 12개월" 옵션을 포함한 드롭박스 옵션
  const viewOptions = [
    { value: "last12months", label: "지난 12개월" },
    ...years.map((year) => ({ value: year.toString(), label: `${year}년` })),
  ];

  // 선택된 보기 옵션 (기본값: "지난 12개월")
  const [selectedView, setSelectedView] = useState<string>("last12months");

  // 시작 날짜와 종료 날짜 계산
  const getDateRange = () => {
    if (selectedView === "last12months") {
      // 지난 12개월 보기 (현재 월의 마지막 날부터 12개월 전의 1일까지)
      const endDate = new Date(currentYear, today.getMonth() + 1, 0); // 현재 월의 마지막 날
      const startDate = new Date(currentYear, today.getMonth() - 11, 1); // 12개월 전의 1일
      return { startDate, endDate };
    } else {
      // 특정 연도 보기 (1월 1일부터 12월 31일까지)
      const year = parseInt(selectedView);
      const startDate = new Date(year, 0, 1); // 1월 1일
      const endDate = new Date(year, 11, 31); // 12월 31일
      return { startDate, endDate };
    }
  };

  const { startDate, endDate } = getDateRange();

  useEffect(() => {
    const loadReportData = async () => {
      // StrictMode에서 중복 요청을 방지
      if (apiRequestMade.current) return;
      apiRequestMade.current = true;

      try {
        // 학습 참여도 데이터 가져오기
        const contributionData = await fetchLearningContribution(
          selectedView === "last12months" ? undefined : parseInt(selectedView)
        );

        // 퀴즈 통계 데이터 가져오기
        const quizStatsData = await fetchQuizStats();

        // 두 데이터를 병합하여 상태 업데이트
        setReportData((prevData) => {
          if (!prevData) return null;
          return {
            ...prevData,
            learningContribution: contributionData,
            totalQuizCount: quizStatsData.totalQuizCount,
            solvedQuizCount: quizStatsData.solvedQuizCount,
          };
        });
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        // 다음 선택 변경 시 다시 요청할 수 있도록 setTimeout으로 초기화
        setTimeout(() => {
          apiRequestMade.current = false;
        }, 100);
      }
    };
    loadReportData();
  }, [selectedView]);

  // 데이터 로딩 중인 경우
  if (!reportData) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  // 선택된 날짜 범위에 맞는 데이터만 필터링
  const filteredContributions = reportData.learningContribution.filter((contrib) => {
    const contribDate = new Date(contrib.date);
    return contribDate >= startDate && contribDate <= endDate;
  });

  // 컬렉션별 정답률 차트 데이터
  const barChartData = {
    labels: reportData.collectionAccuracy.map((item) => item.name),
    datasets: [
      {
        label: "정답률 (%)",
        data: reportData.collectionAccuracy.map((item) => item.latestAccuracy),
        backgroundColor: ["#FFCE56", "#6A5ACD", "#CCCCCC", "#3CB371", "#3E6FFA"],
      },
    ],
  };

  // 컬렉션별 분포도 차트 데이터
  const pieChartData = {
    labels: [
      ...reportData.topCollections.map((item) => `${item.name} (${item.problemCount})`),
      `기타 (${reportData.otherCollectionsCount}) `,
    ],
    datasets: [
      {
        data: [
          ...reportData.topCollections.map((item) => item.problemCount),
          reportData.otherCollectionsCount,
        ],
        backgroundColor: [
          "#3E6FFA",
          "#FFCE56",
          "#3CB371",
          "#CCCCCC", // 기타 항목 색상
        ],
      },
    ],
  };

  return (
    <div className="mb-20">
      <div className="flex items-center gap-2 mb-8">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">분석 레포트</h2>
        <div className="flex justify-end gap-4 ml-auto font-pre-medium">
          <div
            className="flex bg-gradient-to-r from-[#5997FF] to-[#3E6FFA] rounded-lg shadow text-white relative"
            style={{ borderRadius: "8px", width: "180px", height: "64px" }}
          >
            <div className="flex items-center justify-center" style={{ width: "48px" }}>
              <img src={bookicon} alt="Book Icon" className="w-6" />
            </div>

            {/* 텍스트 박스를 절대 위치로 중앙 정렬 */}
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="text-sm text-center">전체 퀴즈 개수</div>
              <div className="text-xl font-bold text-center">{reportData.totalQuizCount}</div>
            </div>
          </div>

          <div
            className="flex bg-gradient-to-r from-[#5997FF] to-[#3E6FFA] rounded-lg shadow text-white relative"
            style={{ borderRadius: "8px", width: "180px", height: "64px" }}
          >
            {/* 아이콘 */}
            <div className="flex items-center justify-center" style={{ width: "48px" }}>
              <img src={openbookicon} alt="Open Book Icon" className="w-6" />
            </div>

            {/* 중앙 정렬된 텍스트 */}
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <div className="text-sm text-center">푼 퀴즈 개수</div>
              <div className="text-xl font-bold text-center">{reportData.solvedQuizCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-normal shadow-md mb-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">학습 참여도</h3>
          {/* 보기 옵션 드롭박스 */}
          <select
            className="border border-normal  rounded px-2 py-1 text-sm font-pre-regular"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            {viewOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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

        <div className="text-xs text-gray-500 mt-2 flex justify-end">
          적음
          <div className="flex ml-1">
            <div className="w-3 h-3 bg-[#ebedf0] mx-1"></div>
            <div className="w-3 h-3 bg-lightactive mx-1"></div>
            <div className="w-3 h-3 bg-normal mx-1"></div>
            <div className="w-3 h-3 bg-normalhover mx-1"></div>
            <div className="w-3 h-3 bg-normalactive mx-1"></div>
          </div>
          많음
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-1">
        <div className="bg-white p-6 rounded-lg border border-normal shadow-md">
          <h3 className="text-lg font-semibold mb-2">컬렉션별 정답률</h3>
          <div className="overflow-x-auto">
            <div
              style={{
                width: `${Math.max(reportData.collectionAccuracy.length * 90, 500)}px`, // 최소 너비를 500px로 설정
                height: "300px",
              }}
            >
              <Bar
                data={{
                  ...barChartData,
                  datasets: barChartData.datasets.map((dataset) => ({
                    ...dataset,
                    barThickness: 80, // 각 막대의 너비를 80px로 고정
                    categoryPercentage: 0.8, // 카테고리 간격을 0.8로 설정하여 간격 확보
                  })),
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: {
                        autoSkip: false,
                      },
                      grid: {
                        offset: false,
                      },
                    },
                    y: {
                      min: 0,
                      max: 100,
                      ticks: {
                        stepSize: 20,
                      },
                    },
                  },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-normal shadow-md">
          <h3 className="text-lg font-semibold mb-2">컬렉션별 분포도</h3>
          <div className="flex flex-col justify-center items-center">
            <div style={{ height: "240px", width: "240px" }}>
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false, // 차트 내 레전드 비활성화
                    },
                  },
                }}
              />
            </div>
            {/* 레전드를 차트 외부에 별도로 구현 */}
            <div className="flex justify-center mt-4">
              {pieChartData.labels.map((label, index) => (
                <div key={index} className="flex items-center mx-2">
                  <div
                    className="w-3 h-3"
                    style={{
                      backgroundColor: pieChartData.datasets[0].backgroundColor[index],
                    }}
                  ></div>
                  <span className="ml-1 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AnalysisReport;
