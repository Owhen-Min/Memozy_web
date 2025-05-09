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

  const { point, totalQuizCount, myWrongQuizCount, round } =
    quizResultData.data;

  const handleWrongNoteClick = () => {
    // 오답노트 페이지로 이동
    console.log("오답노트 바로가기 클릭");
  };

  const handleMoreQuizClick = () => {
    // 다음 퀴즈 풀기 또는 더 많은 퀴즈 보기 페이지로 이동
    console.log("지금 컬렉션 퀴즈 더 풀어보기 클릭");
  };

  const navigate = useNavigate();

  return (
    <div className="content-quiz">
      <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
        <img src={small_logo} alt="logo" className="w-10 h-10" />
        Quiz :
        <span className="text-normalactive">
          {quizShowData.data.collectionName}
        </span>
      </h1>
      <div className="w-full bg-white rounded-xl shadow-xl p-8 flex flex-col h-[70vh] justify-between relative">
        {/* 캐릭터 이미지 */}
        <div className="absolute bottom-8 right-8">
          <img src={rightmonster} alt="Memozy Character" className="h-36" />
        </div>

        {/* 상단 컨텐츠 영역 */}
        <div className="w-1/2 h-3/4 bg-blue-50 p-8 rounded-xl flex flex-col">
          <p className="font-pre-medium">나의 점수</p>
          <div className="flex items-end mt-2 mb-6 pb-1 border-b border-gray-300">
            <span className="text-[54px] leading-none text-blue-600 font-pre-bold">
              {point}
            </span>
            <span className="text-[24px] text-gray-600 ml-2 mb-[1px] font-pre-medium">
              점
            </span>
            <span className="ml-6 mb-[2px] font-pre-medium">{round}회차</span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-pre-medium">총 퀴즈 수 : {totalQuizCount}퀴즈</p>
            <p className="font-pre-medium">
              틀린 퀴즈 수 : {myWrongQuizCount}퀴즈
            </p>

            <button
              onClick={handleWrongNoteClick}
              className="flex items-center mt-8 font-pre-medium hover:text-blue-600"
            >
              오답노트 바로가기
              <img src={book} alt="책아이콘" className="w-4 ml-1" />
            </button>

            <button
              onClick={handleMoreQuizClick}
              className="flex items-center font-pre-medium hover:text-blue-600"
            >
              지금 컬렉션 퀴즈 더 풀어보기
              <img src={openbook} alt="열린책아이콘" className="w-5 ml-1" />
            </button>
          </div>
        </div>

        {/* 하단 버튼 영역 - 위로 올림 */}
        <div className="flex justify-center">
          <button
            className="border border-red text-red rounded-lg p-2 flex items-center gap-2"
            onClick={() => navigate(`/collection/${collectionId}`)}
          >
            <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6" />
            컬렉션 리스트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizShowResultPersonalPage;
