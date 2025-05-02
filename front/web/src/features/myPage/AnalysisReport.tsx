import { useState, useEffect } from "react";
import small_logo from "../../assets/images/small_logo.png";
import { analysisReportData } from "../../dummy/analysisReportData";
import { AnalysisReportData } from "../../types/analysisReport"; // 타입 임포트

// 학습 참여도 캘린더 히트맵을 위한 라이브러리
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AnalysisReport() {
  const [reportData, setReportData] = useState<AnalysisReportData | null>(null);

  useEffect(() => {
    // 더미 데이터 사용 (API 요청 대신)
    setReportData(analysisReportData.data);
  }, []);

  // 데이터 로딩 중인 경우
  if (!reportData) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const barChartData = {
    labels: reportData.collectionAccuracy.map((item) => item.name),
    datasets: [
      {
        label: "정답률 (%)",
        data: reportData.collectionAccuracy.map((item) => item.latestAccuracy),
        backgroundColor: [
          "#FF6384",
          "#6A5ACD",
          "#3CB371",
          "#FFB347",
          "#4BC0C0",
        ],
      },
    ],
  };

  const pieChartData = {
    labels: [
      ...reportData.topCollections.map(
        (item) => `${item.name} (${item.problemCount})`
      ),
      `기타 (${reportData.otherCollectionsCount})`,
    ],
    datasets: [
      {
        data: [
          ...reportData.topCollections.map((item) => item.problemCount),
          reportData.otherCollectionsCount,
        ],
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#CCCCCC", // 기타 항목 색상
        ],
      },
    ],
  };

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">분석 레포트</h2>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center w-40">
            <div className="text-blue-500 text-xl font-bold">
              {reportData.totalQuizCount}
            </div>
            <div className="text-sm">전체 퀴즈 개수</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center w-40">
            <div className="text-blue-500 text-xl font-bold">
              {reportData.solvedQuizCount}
            </div>
            <div className="text-sm">푼 퀴즈 개수</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">학습 참여도</h3>
        <CalendarHeatmap
          startDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
          endDate={new Date()}
          values={reportData.learningContribution}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return `color-scale-${value.level}`;
          }}
        />

        <div className="text-xs text-gray-500 mt-2 flex justify-end">
          적음
          <div className="flex ml-1">
            <div className="w-3 h-3 bg-[#ebedf0] mx-1"></div>
            <div className="w-3 h-3 bg-[#c6e48b] mx-1"></div>
            <div className="w-3 h-3 bg-[#7bc96f] mx-1"></div>
            <div className="w-3 h-3 bg-[#239a3b] mx-1"></div>
            <div className="w-3 h-3 bg-[#196127] mx-1"></div>
          </div>
          많음
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">
            컬렉션별 정답률 (가장 최근 풀이 기준)
          </h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-2">컬렉션 분포도</h3>
          <div style={{ height: "200px", width: "200px" }}>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AnalysisReport;
