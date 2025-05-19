import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { TopCollection } from "../../../types/analysisReport";

// ChartJS 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

// 차트 글로벌 기본값 설정
ChartJS.defaults.font.family =
  "'Pretendard-Regular', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif";
ChartJS.defaults.color = "#333";

interface CollectionDistributionChartProps {
  topCollections: TopCollection[];
  otherCollectionsCount: number;
}

export default function CollectionDistributionChart({
  topCollections,
  otherCollectionsCount,
}: CollectionDistributionChartProps) {
  const pieChartData = {
    labels: [
      ...topCollections.map((item) => `${item.name} (${item.problemCount})`),
      ...(otherCollectionsCount > 0 ? [`기타 (${otherCollectionsCount})`] : []),
    ],
    datasets: [
      {
        data: [
          ...topCollections.map((item) => item.problemCount),
          ...(otherCollectionsCount > 0 ? [otherCollectionsCount] : []),
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
    <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md">
      <h3 className="text-14 md:text-[18px] font-pre-semibold mb-1 md:mb-2">컬렉션 분포도</h3>
      <p className="text-12 text-gray-600 mb-10 font-pre-regular">
        전체 문제 중 컬렉션별 문제 비율로, 주로 학습한 주제를 확인할 수 있습니다.
      </p>
      {topCollections && topCollections.length > 0 ? (
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
        <div className="flex flex-col items-center justify-center text-gray-500">
          <p className="text-14 md:text-16 font-pre-medium">컬렉션에 문제가 존재하지 않습니다.</p>
          <p className="mt-2 text-12 md:text-14">
            각 컬렉션에 문제를 생성해 컬렉션분포도 그래프를 확인해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
