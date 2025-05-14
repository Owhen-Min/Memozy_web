import small_logo from "../assets/images/small_logo.png";
import { quizShowData } from "../dummy/quizShowData";
import { quizResultData } from "../dummy/quizResultData";
import rightmonster from "../assets/images/rightmonster.png";
import openbook from "../assets/icons/blackopenbook.svg";
import book from "../assets/icons/summaryIcon.svg";
import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
import { useNavigate, useParams } from "react-router";
// import { useNavigate, useParams, useLocation } from "react-router";

// interface QuizShowResultPersonalPageProps {
//   quizSessionId: string;
// }

function QuizShowResultPersonalPage() {
  // const location = useLocation();
  // const { } = location.state as QuizShowResultPersonalPageProps;
  const collectionId = useParams().collectionId;

  const { point, totalQuizCount, myWrongQuizCount, round } = quizResultData.data;

  const handleWrongNoteClick = () => {
    console.log("오답노트 바로가기 클릭"); //아직 연결 안함
  };

  const handleMoreQuizClick = () => {
    console.log("지금 컬렉션 퀴즈 더 풀어보기 클릭"); //아직 연결 안함
  };

  const navigate = useNavigate();

  return (
    <div className="content-quiz">
      <div className="text-16 md:text-[28px] font-pre-semibold mb-4 text-main200 flex items-center w-full">
        <div className="flex items-center gap-1 md:gap-2 w-full overflow-hidden">
          <img src={small_logo} alt="logo" className="w-6 md:w-10 flex-shrink-0" />
          <span className="whitespace-nowrap flex-shrink-0">Quiz : </span>
          <span
            className="text-normalactive truncate md:overflow-visible md:whitespace-normal"
            title={quizShowData.data.collectionName}
          >
            {quizShowData.data.collectionName}
          </span>
        </div>
      </div>
      <div className="w-full bg-white rounded-xl shadow-xl p-4 md:p-8 flex flex-col h-[80vh] md:h-[70vh] justify-between relative">
        {/* 캐릭터 이미지 - 모바일에서는 숨김 */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
          <img src={rightmonster} alt="Memozy Character" className="h-24 md:h-40 hidden sm:block" />
        </div>

        {/* 상단 컨텐츠 영역 */}
        <div className="w-full md:w-1/2 h-auto md:h-4/5 bg-blue-50 p-4 md:p-8 rounded-xl flex flex-col text-16 md:text-20">
          <p className="font-pre-medium">나의 점수</p>
          <div className="flex items-end mt-2 mb-4 md:mb-6 pb-1 border-b-2 border-gray-300">
            <span className="text-[36px] md:text-[54px] leading-none text-normal font-pre-bold">
              {point}
            </span>
            <span className="text-20 md:text-24 text-gray-600 ml-2 mb-[1px] font-pre-medium">
              점
            </span>
            <span className="ml-4 md:ml-6 mb-[2px] font-pre-medium">{round}회차</span>
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-pre-medium text-14 md:text-20">총 퀴즈 수 : {totalQuizCount}개</p>
            <p className="font-pre-medium text-14 md:text-20">
              틀린 퀴즈 수 : {myWrongQuizCount}개
            </p>

            <button
              onClick={handleWrongNoteClick}
              className="group flex items-center mt-6 md:mt-8 font-pre-medium hover:text-blue-600 text-14 md:text-20"
            >
              오답노트 바로가기
              <img
                src={book}
                alt="책아이콘"
                className="w-3 md:w-4 ml-1 group-hover:text-blue-600 group-hover:[filter:invert(40%)_sepia(50%)_saturate(800%)_hue-rotate(190deg)_brightness(101%)_contrast(102%)]"
              />
            </button>

            <button
              onClick={handleMoreQuizClick}
              className="group flex items-center font-pre-medium hover:text-blue-600 text-14 md:text-20"
            >
              지금 컬렉션 퀴즈 더 풀어보기
              <img
                src={openbook}
                alt="열린책아이콘"
                className="w-4 md:w-5 ml-1 group-hover:text-blue-600 group-hover:[filter:invert(40%)_sepia(50%)_saturate(800%)_hue-rotate(190deg)_brightness(101%)_contrast(102%)]"
              />
            </button>
          </div>
        </div>

        {/* 하단 버튼 영역 - 위로 올림 */}
        <div className="flex justify-center mt-6 md:mt-0">
          <button
            className="border border-red text-red rounded-lg p-2 flex items-center gap-2 transition-transform duration-200 hover:scale-110"
            onClick={() => navigate(`/collection/${collectionId}`)}
          >
            <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
            컬렉션 리스트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizShowResultPersonalPage;
