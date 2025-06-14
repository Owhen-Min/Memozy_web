import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CollectionAccuracy } from "../../../types/analysisReport";

// ChartJS 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 차트 글로벌 기본값 설정
ChartJS.defaults.font.family =
  "'Pretendard-Regular', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif";
ChartJS.defaults.color = "#333";

interface CollectionAccuracyChartProps {
  collectionAccuracy: CollectionAccuracy[];
}

export default function CollectionAccuracyChart({
  collectionAccuracy,
}: CollectionAccuracyChartProps) {
  const MAX_LABEL_LENGTH = 5;

  // x축 labels: 5자 초과면 ...으로 표시
  const shortLabels = [...collectionAccuracy]
    .reverse()
    .map((item) =>
      item.name.length > MAX_LABEL_LENGTH ? item.name.slice(0, MAX_LABEL_LENGTH) + "..." : item.name
    );

  // 툴팁 title: 원본 전체 이름
  const originalLabels = [...collectionAccuracy].reverse().map((item) => item.name);

  const barChartData = {
    labels: shortLabels,
    datasets: [
      {
        label: "정답률 (%)",
        data: [...collectionAccuracy].reverse().map((item) => item.latestAccuracy),
        backgroundColor: ["#FFCE56", "#6A5ACD", "#CCCCCC", "#3CB371", "#3E6FFA"],
      },
    ],
  };

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
        callbacks: {
          title: function (context: any) {
            // context[0].dataIndex로 원본 데이터 접근
            const idx = context[0].dataIndex;
            return originalLabels[idx];
          },
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
    datasets: {
      bar: {
        minBarLength: 4, // 최소 막대 길이 설정
      },
    },
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-normal shadow-md">
      <h3 className="text-14 md:text-[18px] font-pre-semibold mb-1 md:mb-2">컬렉션별 정답률</h3>
      <p className="text-12 text-gray-600 font-pre-regular">
        컬렉션별 가장 최근 퀴즈풀이의 정답률을 보여줍니다.
      </p>
      {collectionAccuracy && collectionAccuracy.length > 0 ? (
        <div className="overflow-x-auto show-horizontal-scrollbar">
          <div
            style={{
              width: `${Math.max(collectionAccuracy.length * 80, 300)}px`,
              minWidth: "100%",
              height: "250px",
            }}
          >
            <Bar
              data={{
                ...barChartData,
                datasets: barChartData.datasets.map((dataset) => ({
                  ...dataset,
                  barThickness: 40,
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,
                })),
              }}
              options={{
                ...barChartOptions,
                layout: {
                  padding: {
                    left: 20,
                    right: 20,
                  },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <p className="text-14 md:text-16 font-pre-medium">퀴즈 풀이 기록이 존재하지 않습니다.</p>
          <p className="mt-2 text-12 md:text-14">
            퀴즈를 풀고 컬렉션별 정답률 그래프를 확인해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
