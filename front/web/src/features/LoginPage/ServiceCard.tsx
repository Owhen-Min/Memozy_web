import collectionIcon from "../../assets/images/collectionIcon.png";
import quizIcon from "../../assets/images/quizIcon.png";
import reportIcon from "../../assets/images/reportIcon.png";
import wrongIcon from "../../assets/images/wrongIcon.png";
import noteIcon from "../../assets/images/noteIcon.png";
import extensionIcon from "../../assets/images/extensionIcon.png";

const ServiceCards = () => {
  return (
    <div className="w-full ml-12">
      {/* 상단 행 카드 */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="bg-[#E8F0FE] pt-4 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-2 flex items-center justify-center">
            <img src={collectionIcon} alt="컬렉션 아이콘" className="w-14" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#307DB4] mb-1">컬렉션리스트</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            저장한 내용을 주제별로
            <br />
            정리한 컬렉션목록 조회
          </p>
        </div>

        <div className="bg-[#FFF8E1] pt-2.5 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-0.5 flex items-center justify-center">
            <img src={quizIcon} alt="퀴즈 아이콘" className="w-14" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#FFA726] mb-1">퀴즈</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            저장한 내용을 바탕으로
            <br />
            gpt기반 퀴즈 자동 생성
          </p>
        </div>

        <div className="bg-[#EDE7F6] pt-5 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-1 flex items-center justify-center">
            <img src={reportIcon} alt="분석레포트 아이콘" className="w-12" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#6A1B9A] mb-1">분석레포트</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            컬렉션별 정답률과 학습율
            <br />등 다양한 그래프의 시각화
          </p>
        </div>
      </div>

      {/* 하단 행 카드 */}
      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-[#FFEBEE] pt-4 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-2 flex items-center justify-center">
            <img src={wrongIcon} alt="오답노트 아이콘" className="w-10" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#FF5722] mb-1">오답노트</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            회차별로 틀린 퀴즈만
            <br />
            모은 효율적인 복습 기능{" "}
          </p>
        </div>

        <div className="bg-[#E8F5E9] pt-4 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-2 flex items-center justify-center">
            <img src={noteIcon} alt="요약노트 아이콘" className="w-10" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#4CAF50] mb-1">요약노트</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            학습한 내용의 요점을
            <br />
            자동으로 정리해주는 기능
          </p>
        </div>

        <div className="bg-[#E3F2FD] pt-4 rounded-xl flex flex-col items-center shadow-lg h-[150px] w-40">
          <div className="mb-2 flex items-center justify-center">
            <img src={extensionIcon} alt="익스텐션 아이콘" className="w-12" />
          </div>
          <h3 className="text-16 font-pre-semibold text-[#2196F3] mb-1">익스텐션</h3>
          <p className="text-10 font-pre-regular text-center text-gray-600">
            노션, 블로그, 기술문서 등
            <br />
            원하는 내용을 직접 저장해 학습
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
