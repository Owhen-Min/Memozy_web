import small_logo from "../../assets/images/small_logo.png";
import rightmonster from "../../assets/images/quizshowImg.png";
import save from "../../assets/icons/save.svg";
import book from "../../assets/icons/summaryIcon.svg";
import first from "../../assets/images/first.png";
import second from "../../assets/images/second.png";
import third from "../../assets/images/third.png";
import { useQuizShowSharedResult } from "../../hooks/sharedQuizShow";
import MostWrongQuiz from "../../components/quizShowPage/MostWrongQuiz";

interface QuizShowMyResult {
  myCorrectQuizCount: number;
  myScore: number;
  totalQuizCount: number;
}

interface QuizShowResult {
  mostWrongQuiz: {
    type: "OX" | "MULTIPLE_CHOICE";
    content: string;
    answer: string;
    commentary: string;
    wrongRate: number;
    choice: string[];
    quizId?: string;
  };
  topRanking: {
    rank: number;
    name: string;
    score: number;
  }[];
  collectionName: string;
}

interface QuizShowSharedResultProps {
  myResult: QuizShowMyResult | {};
  result: QuizShowResult | {};
  collectionName: string;
  isLoading?: boolean;
  isHost: boolean;
  isLoggedIn: boolean;
  handleSaveQuizClick: () => void;
}

function QuizShowResultSharedPage({
  myResult,
  result,
  collectionName,
  isLoading = true,
  isLoggedIn,
  handleSaveQuizClick,
}: QuizShowSharedResultProps) {
  const {
    myScore,
    totalQuizCount,
    myWrongQuizCount,
    isResultLoading,
    mostWrongQuiz,
    processedRanking,
    showMostWrongQuizModal,
    handleMostWrongQuizClick,
    handleCloseMostWrongQuiz,
  } = useQuizShowSharedResult({
    myResult,
    result,
    isLoading,
  });

  // 랭킹 데이터 이미지 매핑
  const rankImages = [first, second, third];

  return (
    <>
      <div className="text-16 md:text-[28px] font-pre-semibold mb-4 text-main200 flex items-center w-full">
        <div className="flex items-center gap-1 md:gap-2 w-full overflow-hidden">
          <img src={small_logo} alt="logo" className="w-6 md:w-10 flex-shrink-0" />
          <span className="whitespace-nowrap flex-shrink-0">Quiz : </span>
          <span className="text-normalactive truncate md:overflow-visible md:whitespace-normal">
            {collectionName || "퀴즈 결과"}
          </span>
        </div>
      </div>
      {isResultLoading ? (
        <div className="w-full bg-white rounded-xl shadow-xl p-4 md:p-8 flex flex-col h-[80vh] md:h-[70vh] justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-main200 mb-4"></div>
          <p className="text-16 md:text-20 font-pre-medium text-main200">
            결과를 불러오는 중입니다...
          </p>
          <p className="text-14 md:text-16 text-gray-500 mt-2">
            다른 참가자들이 모든 문제를 풀면 결과가 표시됩니다.
          </p>
        </div>
      ) : (
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
                {myScore}
              </span>
              <span className="text-20 md:text-24 text-gray-600 ml-2 mb-[1px] font-pre-medium">
                점
              </span>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <p className="font-pre-medium text-14 md:text-20">총 퀴즈 수 : {totalQuizCount}개</p>
              <p className="font-pre-medium text-14 md:text-20">
                틀린 퀴즈 수 : {myWrongQuizCount}개
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
              {isLoggedIn && (
                <button
                  onClick={handleSaveQuizClick}
                  className="group flex items-center font-pre-medium hover:text-blue-600 text-14 md:text-20"
                >
                  나의 컬렉션에 저장하기
                  <img
                    src={save}
                    alt="저장아이콘"
                    className="w-4 md:w-5 ml-1 group-hover:text-blue-600 group-hover:[filter:invert(40%)_sepia(50%)_saturate(800%)_hue-rotate(190deg)_brightness(101%)_contrast(102%)]"
                  />
                </button>
              )}
            </div>
          </div>

          {/* 랭킹 영역 - 모든 화면 크기 */}
          <div className="block md:absolute md:right-24 md:top-16 mt-4 md:mt-0">
            {processedRanking.map((ranker) => (
              <div key={ranker.rank} className="flex items-center mb-8">
                <img src={rankImages[ranker.imageIndex]} alt={`${ranker.rank}`} className="w-4" />
                <span className="text-14 md:text-16 font-pre-semibold ml-3">{ranker.name}</span>
                <span className="text-14 md:text-16 font-pre-semibold ml-3">{ranker.score}</span>
              </div>
            ))}
          </div>

          {/* 가장 많이 틀린 퀴즈 모달 */}
          {showMostWrongQuizModal && (
            <MostWrongQuiz
              content={mostWrongQuiz.content || ""}
              answer={mostWrongQuiz.answer || ""}
              commentary={mostWrongQuiz.commentary || ""}
              wrongRate={mostWrongQuiz.wrongRate || 0}
              onClose={handleCloseMostWrongQuiz}
            />
          )}
        </div>
      )}
    </>
  );
}

export default QuizShowResultSharedPage;
