import small_logo from "../assets/images/small_logo.png";
import rightmonster from "../assets/images/rightmonster.png";
import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
import { useNavigate, useParams } from "react-router";
import { useQuizShowPersonalStore } from "../stores/quizShowPersonal/quizShowPersonalStore";
import { useEffect } from "react";
import folder from "../assets/icons/folder.svg";

function QuizShowResultPersonalPage() {
  const navigate = useNavigate();
  const collectionId = useParams().collectionId;
  const quizSessionId = useParams().quizSessionId;
  const { getQuizResult, quizResult, isLoading, error } = useQuizShowPersonalStore();

  useEffect(() => {
    // quizResult가 없고 quizSessionId가 있을 때만 API 호출
    if (quizSessionId && !quizResult) {
      getQuizResult(quizSessionId);
    }
  }, [quizSessionId, quizResult, getQuizResult]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-20 font-pre-medium">결과를 불러오는 중...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-20 font-pre-medium text-red">{error}</div>
        </div>
      );
    }

    if (!quizResult) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-20 font-pre-medium">결과 데이터가 없습니다.</div>
        </div>
      );
    }

    // API 응답 데이터 구조에 맞게 데이터 추출
    const { totalQuizCount, myWrongQuizCount, round, point, previousPoint, collectionName } =
      quizResult;

    return (
      <>
        <div className="text-16 md:text-[28px] font-pre-semibold mb-4 text-main200 flex items-center w-full">
          <div className="flex items-center gap-1 md:gap-2 w-full overflow-hidden">
            <img src={small_logo} alt="logo" className="w-6 md:w-10 flex-shrink-0" />
            <span className="whitespace-nowrap flex-shrink-0">Quiz : </span>
            <span
              className="text-normalactive truncate md:overflow-visible md:whitespace-normal"
              title={collectionName}
            >
              {collectionName}
            </span>
          </div>
        </div>
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
              <span className="ml-4 md:ml-6 mb-[2px] font-pre-medium">{round}회차</span>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <p className="font-pre-medium text-14 md:text-20">총 퀴즈 수 : {totalQuizCount}개</p>
              <p className="font-pre-medium text-14 md:text-20">
                틀린 퀴즈 수 : {myWrongQuizCount}개
              </p>
              <p className="font-pre-medium text-14 md:text-20">
                지난 회차 대비 점수 차이 :{" "}
                <span
                  className={`font-pre-bold text-16 md:text-24 ${
                    point - previousPoint > 0
                      ? "text-green-600"
                      : point - previousPoint < 0
                        ? "text-red"
                        : "text-gray-600"
                  }`}
                >
                  {point - previousPoint > 0
                    ? `+${point - previousPoint}`
                    : point - previousPoint < 0
                      ? `${point - previousPoint}`
                      : "0"}
                  점
                </span>
              </p>
              <p
                className="font-pre-semibold text-14 md:text-20 flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-110 text-normalactive"
                onClick={() => navigate(`/my`)}
              >
                회차별 오답노트 확인하러 가기
                <img src={folder} alt="folder" className="w-6 h-6" />
              </p>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
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
      </>
    );
  };

  return <div className="content-quiz">{renderContent()}</div>;
}

export default QuizShowResultPersonalPage;
