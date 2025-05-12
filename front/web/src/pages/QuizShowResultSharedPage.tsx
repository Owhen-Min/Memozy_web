import small_logo from "../assets/images/small_logo.png";
import { quizShowData } from "../dummy/quizShowData";
import { quizResultData } from "../dummy/quizResultData";
import rightmonster from "../assets/images/quizshowImg.png";
import save from "../assets/icons/save.svg";
import book from "../assets/icons/summaryIcon.svg";
import first from "../assets/images/first.png";
import second from "../assets/images/second.png";
import third from "../assets/images/third.png";
import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
import { useNavigate, useParams } from "react-router";

function QuizShowResultSharedPage() {
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const { point, totalQuizCount, myWrongQuizCount, round } =
    quizResultData.data;

  const handleMostWrongQuizClick = () => {
    console.log("친구들이 가장 많이 틀린 퀴즈 클릭");
  };

  const handleMoreQuizClick = () => {
    // 다음 퀴즈 풀기 또는 더 많은 퀴즈 보기 페이지로 이동
    console.log("지금 컬렉션 퀴즈 더 풀어보기 클릭");
  };

  // 상위 랭킹 데이터
  const topRankers = [
    { rank: 1, name: "이가희", score: "100점", image: first },
    { rank: 2, name: "민경현", score: "97점", image: second },
    { rank: 3, name: "이학준", score: "95점", image: third },
  ];

  return (
    <div className="content-quiz">
      <h1 className="text-20 md:text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
        <img src={small_logo} alt="logo" className="w-8 h-8 md:w-10" />
        Quiz :
        <span className="text-normalactive">
          {quizShowData.data.collectionName}
        </span>
      </h1>
      <div className="w-full bg-white rounded-xl shadow-xl p-4 md:p-8 flex flex-col h-[80vh] md:h-[70vh] justify-between relative">
        {/* 캐릭터 이미지 - 모바일에서는 숨김 */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
          <img
            src={rightmonster}
            alt="Memozy Character"
            className="h-24 md:h-40 hidden sm:block"
          />
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
            <span className="ml-4 md:ml-6 mb-[2px] font-pre-medium">
              {round}회차
            </span>
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            <p className="font-pre-medium text-14 md:text-20">
              총 퀴즈 수 : {totalQuizCount}퀴즈
            </p>
            <p className="font-pre-medium text-14 md:text-20">
              틀린 퀴즈 수 : {myWrongQuizCount}퀴즈
            </p>

            <button
              onClick={handleMostWrongQuizClick}
              className="group flex items-center mt-6 md:mt-8 font-pre-medium hover:text-blue-600 text-14 md:text-20"
            >
              친구들이 가장 많이 틀린 퀴즈
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
              나의 컬렉션에 저장하기
              <img
                src={save}
                alt="저장아이콘"
                className="w-4 md:w-5 ml-1 group-hover:text-blue-600 group-hover:[filter:invert(40%)_sepia(50%)_saturate(800%)_hue-rotate(190deg)_brightness(101%)_contrast(102%)]"
              />
            </button>
          </div>
        </div>

        {/* 랭킹 영역 - 모든 화면 크기 */}
        <div className="block md:absolute md:right-24 md:top-16 mt-4 md:mt-0">
          {topRankers.map((ranker) => (
            <div key={ranker.rank} className="flex items-center mb-8">
              <img src={ranker.image} alt={`${ranker.rank}`} className="w-4" />
              <span className="text-14 md:text-16 font-pre-semibold ml-3">
                {ranker.name}
              </span>
              <span className="text-14 md:text-16 font-pre-semibold ml-3">
                {ranker.score}
              </span>
            </div>
          ))}
        </div>

        {/* 하단 버튼 영역 - 위로 올림 */}
        <div className="flex justify-center mt-6 md:mt-0">
          <button
            className="border border-red text-red rounded-lg p-2 flex items-center gap-2 text-14 md:text-16"
            onClick={() => navigate(`/collection/${collectionId}`)}
          >
            <img
              src={outQuizShowIcon}
              alt="outQuizShowIcon"
              className="w-5 md:w-6"
            />
            컬렉션 리스트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizShowResultSharedPage;
