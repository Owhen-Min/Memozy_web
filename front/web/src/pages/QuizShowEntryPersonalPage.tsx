import { useLocation, useNavigate, useParams } from "react-router";
import small_logo from "../assets/images/small_logo.png";
import Memozy_logo from "../assets/images/memozylogo.png";
import monster1 from "../assets/images/monster1.png";
// import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
import { useQuizShowPersonalStore } from "../stores/quizShowPersonal/quizShowPersonalStore";
import { useEffect } from "react";
import { useErrorStore } from "../stores/errorStore";

const QuizShowEntryPersonalPage = () => {
  const { collectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { createQuizShow, quizData, isLoading, error, resetQuiz } = useQuizShowPersonalStore();
  const { setError } = useErrorStore();

  useEffect(() => {
    if (!location || !location?.state) {
      setError("퀴즈쇼는 컬렉션을 통해 들어와야 합니다.", { showButtons: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    // 컴포넌트 마운트 시 이전 상태 초기화
    resetQuiz();

    if (collectionId && location?.state?.quizCount) {
      createQuizShow(Number(collectionId), location?.state?.quizCount);
    }
  }, [collectionId, location, createQuizShow, resetQuiz]);

  const handleStartQuizShow = () => {
    if (!quizData) return;

    navigate(`/quiz-show/personal/${collectionId}/${quizData.quizSessionId}`, {
      state: {
        collectionName: quizData.collectionName,
        quizList: quizData.quizList,
        quizSessionId: quizData.quizSessionId,
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-56px-40px-80px)]">
          <div className="text-20 font-pre-medium">퀴즈쇼를 생성하고 있어요...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-56px-40px-80px)]">
          <div className="text-20 font-pre-medium text-red">{error}</div>
        </div>
      );
    }

    if (!quizData) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-56px-40px-80px)]">
          <div className="text-20 font-pre-medium">퀴즈 데이터가 없습니다.</div>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-2 md:mb-4">
          <h1 className="text-[20px] md:text-[28px] font-pre-semibold text-main200 flex items-center gap-1 md:gap-2 whitespace-nowrap min-w-0">
            <img src={small_logo} alt="logo" className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
            {/* <span className="flex-shrink-0">Quiz :</span> */}
            <span className="text-normalactive truncate text-20 md:text-[28px] min-w-0">
              {quizData.collectionName}
            </span>
          </h1>
          {/* <button
            className="border border-red text-red rounded-lg p-1 flex items-center gap-1 md:gap-2 w-full md:w-auto justify-center text-sm md:text-base mt-2 md:mt-0"
            onClick={() => navigate(`/collection/${collectionId}`)}
          >
            <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-5 h-5 md:w-6 md:h-6" />
            퀴즈 종료하기
          </button> */}
        </div>
        <div className="w-full h-[calc(100vh-176px)] bg-white rounded-xl shadow-xl">
          <div className="flex flex-col items-center pt-12">
            <div className="mb-8 w-52 self-start ml-1 md:ml-16">
              <img src={Memozy_logo} alt="Memozy 로고" />
            </div>

            <div className="w-full relative mb-6">
              <div className="absolute right-4 md:right-20 -top-28 z-20">
                <img src={monster1} alt="몬스터1" className="w-16 md:w-32" />
              </div>

              <div className="relative z-10 ml-4 md:ml-32">
                <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                  <h2 className="text-20 mb-2 font-pre-medium">퀴즈쇼 생성이 완료되었어요!</h2>
                  <p className="text-14 font-pre-regular">
                    준비가 되시면 시작하기 버튼을 눌러 퀴즈쇼를 시작해주세요.
                  </p>
                </div>
              </div>

              <div className="absolute right-4 md:right-10 top-[110px] z-30">
                <div className="bg-white shadow-lg rounded-xl p-6 font-pre-medium">
                  <p>
                    컬렉션 :{" "}
                    <span className="text-16 font-pre-bold">{quizData.collectionName}</span>
                  </p>
                  <p>
                    퀴즈 수 :{" "}
                    <span className="text-16 font-pre-bold">
                      {quizData.quizList?.length || 0} 문항
                    </span>
                  </p>
                  <p>
                    퀴즈쇼 타입 : <span className="text-16 font-pre-bold">개인 퀴즈쇼</span>
                  </p>
                  <button
                    className="w-full bg-light text-main200 font-pre-bold mt-4 p-2 rounded-md border-[1px] border-normal hover:bg-lighthover"
                    onClick={handleStartQuizShow}
                  >
                    시작하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return <div className="content-quiz mt-14">{renderContent()}</div>;
};

export default QuizShowEntryPersonalPage;
