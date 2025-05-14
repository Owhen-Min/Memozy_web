import { useState, useEffect, useRef } from "react";
import small_logo from "../../assets/images/small_logo.png";
import { AnalysisReportData } from "../../types/analysisReport";
import bookicon from "../../assets/icons/book.svg";
import openbookicon from "../../assets/icons/openbook.svg";
import {
  fetchLearningContribution,
  fetchQuizStats,
  fetchCollectionStats,
} from "../../apis/history/historyApi";

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

// 차트 글로벌 기본값 설정
ChartJS.defaults.font.family =
  "'Pretendard-Regular', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif";
ChartJS.defaults.color = "#333";

function AnalysisReport() {
  // 초기 상태를 빈 객체로 설정
  const [reportData, setReportData] = useState<AnalysisReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);

      try {
        // 병렬로 모든 API 요청 실행
        const [contributionData, quizStatsData, collectionStatsData] = await Promise.all([
          fetchLearningContribution(
            selectedView === "last12months" ? undefined : parseInt(selectedView)
          ),
          fetchQuizStats(),
          fetchCollectionStats(),
        ]);

        // 데이터 병합하여 상태 업데이트
        setReportData((_prevData) => {
          const newData = {
            // 기본 reportData 구조를 초기화
            totalQuizCount: quizStatsData.totalQuizCount,
            solvedQuizCount: quizStatsData.solvedQuizCount,
            learningContribution: contributionData,
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
        // 다음 선택 변경 시 다시 요청할 수 있도록 setTimeout으로 초기화
        setTimeout(() => {
          apiRequestMade.current = false;
        }, 100);
      }
    };
    loadReportData();
  }, [selectedView]);

  // 데이터 로딩 중인 경우
  if (isLoading || !reportData) {
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

  // 컬렉션별 정답률 차트 옵션
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    font: {
      family: "'Pretendard-Regular', sans-serif",
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            family: "'Pretendard-Regular', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        titleFont: {
          family: "'Pretendard-Regular', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Pretendard-Regular', sans-serif",
          size: 13,
        },
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          autoSkip: false,
          font: {
            family: "'Pretendard-Regular', sans-serif",
            size: 12,
          },
        },
        grid: {
          offset: true,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            family: "'Pretendard-Regular', sans-serif",
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
    },
  };

  // 컬렉션별 분포도 차트 옵션
  const pieChartOptions = {
    responsive: true,
    font: {
      family: "'Pretendard-Regular', sans-serif",
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            family: "'Pretendard-Regular', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        titleFont: {
          family: "'Pretendard-Regular', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Pretendard-Regular', sans-serif",
          size: 13,
        },
      },
    },
  };

  return (
    <div className="mb-20 px-4 sm:px-0">
      <div className="mb-8">
        {/* 헤더 부분 */}
        <div className="flex items-center overflow-hidden">
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <img src={small_logo} alt="로고" className="w-8 md:w-10" />
            <h2 className="text-24 md:text-[28px] font-pre-medium whitespace-nowrap">
              분석 레포트
            </h2>
          </div>

          {/* 통계박스 - 데스크탑에서만 표시 */}
          <div className="hidden md:flex ml-auto gap-3">
            {[
              { icon: bookicon, label: "전체 퀴즈 개수", value: reportData.totalQuizCount },
              { icon: openbookicon, label: "푼 퀴즈 개수", value: reportData.solvedQuizCount },
            ].map((item, index) => (
              <div
                key={index}
                className="flex bg-gradient-to-r from-[#5997FF] to-[#3E6FFA] rounded-lg shadow text-white w-[170px] h-16 relative"
              >
                <div className="flex items-center px-2 h-full">
                  <img src={item.icon} alt={item.label} className="w-5" />
                </div>
                <div className="flex flex-col justify-center items-center absolute inset-0 ml-8">
                  <div className="text-16 font-pre-regular">{item.label}</div>
                  <div className="text-16 font-pre-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 통계박스 - 모바일에서만 표시 (헤더 아래) */}
        <div className="flex md:hidden justify-center gap-3 mt-4">
          {[
            { icon: bookicon, label: "전체 퀴즈 개수", value: reportData.totalQuizCount },
            { icon: openbookicon, label: "푼 퀴즈 개수", value: reportData.solvedQuizCount },
          ].map((item, index) => (
            <div
              key={index}
              className="flex bg-gradient-to-r from-[#5997FF] to-[#3E6FFA] rounded-lg shadow text-white w-40 h-11 relative"
            >
              <div className="flex items-center px-1.5 h-full">
                <img src={item.icon} alt={item.label} className="w-4" />
              </div>
              <div className="flex flex-col justify-center items-center absolute inset-0 ml-5">
                <div className="text-12 font-pre-regular">{item.label}</div>
                <div className="text-14 font-pre-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 학습 참여도 섹션 - 스크롤 대응 */}
      <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md mb-6 md:mb-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-14 md:text-[18px] font-pre-semibold">학습 참여도</h3>
          <select
            className="border border-normal rounded px-1 py-1 text-xs md:text-sm font-pre-regular"
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

        <p className="text-10 text-gray-600 mb-2 font-pre-regular">
          하루 단위 문제 풀이 기록으로, 색상 강도는 풀이 개수(0, 1-4, 5-9, 10-14, 15+)를 의미합니다.
        </p>

        <div className="overflow-x-auto">
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

        <div className="text-10 md:text-xs text-gray-500 mt-2 flex justify-end">
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

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-1">
        {/* 컬렉션별 정답률 차트 */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md">
          <h3 className="text-14 md:text-[18px] font-pre-semibold mb-1 md:mb-2">컬렉션별 정답률</h3>
          <p className="text-10 text-gray-600 font-pre-regular">
            컬렉션별 가장 최근 문제풀이의 정답률을 보여줍니다.
          </p>
          {reportData.collectionAccuracy && reportData.collectionAccuracy.length > 0 ? (
            <div className="overflow-x-auto">
              <div
                style={{
                  width: `${Math.max(reportData.collectionAccuracy.length * 60, 300)}px`,
                  minWidth: "100%",
                  height: "250px",
                }}
              >
                <Bar
                  data={{
                    ...barChartData,
                    datasets: barChartData.datasets.map((dataset) => ({
                      ...dataset,
                      barThickness: undefined,
                      categoryPercentage: 0.8,
                      barPercentage: 0.9,
                    })),
                  }}
                  options={barChartOptions}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <p>아직 문제를 풀어본 컬렉션이 없습니다.</p>
              <p className="mt-2">문제를 풀면 정답률 데이터가 표시됩니다.</p>
            </div>
          )}
        </div>

        {/* 컬렉션별 분포도 차트 */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md">
          <h3 className="text-14 md:text-[18px] font-pre-semibold mb-1 md:mb-2">컬렉션별 분포도</h3>
          <p className="text-10 text-gray-600 mb-2 font-pre-regular">
            전체 문제 중 컬렉션별 비율로, 주로 학습한 주제 영역을 확인할 수 있습니다.
          </p>
          {reportData.topCollections && reportData.topCollections.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <div style={{ height: "180px", width: "180px", maxWidth: "100%" }}>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
              <div className="flex flex-wrap justify-center mt-2 md:mt-4">
                {pieChartData.labels.map((label, index) => (
                  <div key={index} className="flex items-center mx-1 md:mx-2 mb-1 md:mb-2">
                    <div
                      className="w-2 h-2 md:w-3 md:h-3"
                      style={{
                        backgroundColor: pieChartData.datasets[0].backgroundColor[index],
                      }}
                    ></div>
                    <span className="ml-1 text-10 md:text-14 font-pre-regular">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <p className="text-sm">아직 문제를 풀어본 컬렉션이 없습니다.</p>
              <p className="mt-2 text-sm">문제를 풀면 컬렉션 분포 데이터가 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisReport;
