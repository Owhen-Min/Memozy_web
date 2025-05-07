import { wrongAnswerData } from "../../dummy/wrongAnswerData";
import small_logo from "../../assets/images/small_logo.png";
import folder from "../../assets/images/folder.png";

function WrongAnswerNote() {
  // 더미 데이터에서 오답노트 데이터 가져오기
  const wrongAnswers = wrongAnswerData[0].data || [];

  return (
    <div className="mb-10">
      <div className="flex items-center mb-4">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">오답노트</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {wrongAnswers.map((item) => (
          <div
            key={item.id}
            className="relative cursor-pointer transition-transform hover:scale-105 w-[164px] mx-auto"
          >
            <img src={folder} alt="폴더" className="w-full" />
            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h3 className="text-16 font-pre-medium whitespace-nowrap">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WrongAnswerNote;
