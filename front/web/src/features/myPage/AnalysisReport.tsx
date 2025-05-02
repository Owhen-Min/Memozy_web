import small_logo from "../../assets/images/small_logo.png";

function AnalysisReport() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">분석 레포트</h2>
      </div>

      {/* 학습 참여도 - 한 줄 전체 차지 */}
      <div className="mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-18 font-pre-medium mb-4">학습 참여도</h3>
          {/* 여기에 학습 참여도 그래프 데이터 표시 */}
          <div className="h-[200px]">{/* 그래프 표시 영역 */}</div>
        </div>
      </div>

      {/* 컬렉션별 정답률과 컬렉션 분포도 - 한 줄에 두 개 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 컬렉션별 정답률 */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-18 font-pre-medium mb-4">
            컬렉션별 정답률(가장 높은의 정답률?)
          </h3>
          {/* 여기에 컬렉션별 정답률 그래프 데이터 표시 */}
          <div className="h-[200px]">{/* 그래프 표시 영역 */}</div>
        </div>

        {/* 컬렉션 분포도 */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="text-18 font-pre-medium mb-4">컬렉션 분포도</h3>
          {/* 여기에 컬렉션 분포도 그래프 데이터 표시 */}
          <div className="h-[200px]">{/* 그래프 표시 영역 */}</div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisReport;
