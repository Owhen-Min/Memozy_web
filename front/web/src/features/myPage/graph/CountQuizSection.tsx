import small_logo from "../../../assets/images/small_logo.png";
import bookicon from "../../../assets/icons/book.svg";
import openbookicon from "../../../assets/icons/openbook.svg";

interface CountQuizSectionProps {
  totalQuizCount: number;
  solvedQuizCount: number;
}

export default function CountQuizSection({
  totalQuizCount,
  solvedQuizCount,
}: CountQuizSectionProps) {
  return (
    <div className="mb-8">
      {/* 헤더 부분 */}
      <div className="flex items-center overflow-hidden">
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <img src={small_logo} alt="로고" className="w-8 md:w-10" />
          <h2 className="text-24 md:text-[28px] font-pre-semibold whitespace-nowrap">
            분석 레포트
          </h2>
        </div>

        {/* 통계박스 - 데스크탑에서만 표시 */}
        <div className="hidden md:flex ml-auto gap-3">
          {[
            { icon: bookicon, label: "전체 퀴즈 개수", value: totalQuizCount },
            { icon: openbookicon, label: "푼 퀴즈 개수", value: solvedQuizCount },
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
          { icon: bookicon, label: "전체 퀴즈 개수", value: totalQuizCount },
          { icon: openbookicon, label: "푼 퀴즈 개수", value: solvedQuizCount },
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
  );
}
