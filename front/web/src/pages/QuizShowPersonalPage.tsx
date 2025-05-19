import { useLocation, useNavigate, useParams } from "react-router";
import small_logo from "../assets/images/small_logo.png";
import { Quiz } from "../types/quizShow";
import { useState, useEffect } from "react";
import MultipleChoice from "../components/quizShowPage/MultipleChoice";
import OX from "../components/quizShowPage/OX";
import Objective from "../components/quizShowPage/Objective";
import Progress from "../components/quizShowPage/Progress";
// import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
import nextIcon from "../assets/icons/nextIcon.svg";
import { useQuizShowPersonalStore } from "../stores/quizShowPersonal/quizShowPersonalStore";

interface QuizShowPersonalPageProps {
  collectionName: string;
  quizList: Quiz[];
  quizSessionId: string;
}

function QuizShowPersonalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const collectionId = useParams().collectionId;
  const { submitAnswer } = useQuizShowPersonalStore();

  // 로컬 스토리지에서 데이터 가져오기 또는 새로 저장
  const [quizData] = useState<QuizShowPersonalPageProps>(() => {
    const savedData = localStorage.getItem(`quiz_data_${collectionId}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    // 새로운 데이터가 있으면 저장
    if (location.state) {
      const newData = location.state as QuizShowPersonalPageProps;
      localStorage.setItem(`quiz_data_${collectionId}`, JSON.stringify(newData));
      return newData;
    }
    // 데이터가 없을 때 빈 데이터 반환
    return { collectionName: "", quizList: [], quizSessionId: "" };
  });

  // 데이터가 없는 경우 처리
  if (!quizData.quizList.length) {
    return (
      <div className="content-quiz mt-14">
        <div className="w-full h-[calc(100vh-56px-40px-80px)] bg-white rounded-xl shadow-xl px-8 py-4 flex flex-col items-center justify-center gap-6">
          <h2 className="text-[24px] font-pre-semibold text-gray-600">퀴즈 데이터가 없습니다</h2>
          <p className="text-[16px] text-gray-500">컬렉션에서 퀴즈를 다시 시작해주세요</p>
          <button
            onClick={() => navigate(`/collection/${collectionId}`)}
            className="bg-main200 text-white px-6 py-3 rounded-lg font-pre-medium hover:bg-main300 transition-colors"
          >
            컬렉션 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const { collectionName, quizList, quizSessionId } = quizData;
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<
    string | number | { index: number; value: string } | null
  >(null);

  useEffect(() => {
    if (quizList.length > 0) {
      setCurrentQuiz(quizList[0]);
    }
  }, [quizList]);

  // 새로고침 감지 및 플래그 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 새로고침 시 로컬 스토리지에 플래그 저장
      localStorage.setItem(`quiz_refresh_${collectionId}`, "true");
    };

    // 페이지 로드 시 새로고침 플래그 확인
    const checkRefresh = () => {
      const isRefresh = localStorage.getItem(`quiz_refresh_${collectionId}`);
      if (isRefresh === "true") {
        alert("퀴즈가 종료되었습니다.");
        localStorage.removeItem(`quiz_data_${collectionId}`);
        localStorage.removeItem(`quiz_refresh_${collectionId}`);
        navigate(`/collection/${collectionId}`);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    checkRefresh(); // 컴포넌트 마운트 시 체크

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [collectionId, navigate]);

  // 퀴즈 쇼 종료 시 로컬 스토리지 데이터 삭제
  // const handleExitQuiz = () => {
  //   if (window.confirm("퀴즈 진행 중입니다. 정말로 종료하시겠습니까?")) {
  //     localStorage.removeItem(`quiz_data_${collectionId}`);
  //     navigate(`/collection/${collectionId}`);
  //   }
  // };

  // 퀴즈 완료 시 로컬 스토리지 데이터 삭제
  const handleNextQuiz = () => {
    setShowAnswer(false);
    setUserAnswer(null);
    setIsCorrect(false);
    setCurrentQuizIndex(currentQuizIndex + 1);
    setCurrentQuiz(quizList[currentQuizIndex + 1]);
    if (currentQuizIndex === quizList.length - 1) {
      localStorage.removeItem(`quiz_data_${collectionId}`);
      navigate(`/quiz-result/personal/${collectionId}/${quizSessionId}`, {
        state: {
          collectionName,
        },
      });
    }
  };

  // 브라우저 뒤로가기 이벤트 처리
  useEffect(() => {
    const handlePopState = () => {
      if (!window.confirm("진행 중인 퀴즈 쇼가 종료됩니다. 정말로 나가시겠습니까?")) {
        // 취소 시 현재 상태를 다시 푸시
        window.history.pushState(null, "", window.location.href);
      } else {
        localStorage.removeItem(`quiz_data_${collectionId}`);
        navigate(`/collection/${collectionId}`);
      }
    };

    window.addEventListener("popstate", handlePopState);
    // 초기 상태 푸시
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, collectionId]);

  const handleShowAnswer = async () => {
    if (userAnswer === null) {
      alert("답을 선택해주세요!");
      return;
    }

    const currentQuizData = quizList[currentQuizIndex];
    let answerValue = "";
    let correct = false;

    if (typeof userAnswer === "object" && "value" in userAnswer) {
      answerValue = userAnswer.value;
      correct = currentQuizData.answer === answerValue;
    } else {
      answerValue = userAnswer.toString();
      correct = currentQuizData.answer === answerValue;
    }

    try {
      await submitAnswer(currentQuizData.quizId, answerValue, correct);
      setIsCorrect(correct);
      setShowAnswer(true);
    } catch (error) {
      console.error("답안 제출 중 오류 발생:", error);
      alert("답안 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const renderQuizComponent = (currentQuiz: Quiz) => {
    if (!currentQuiz) return null;

    switch (currentQuiz.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoice
            content={currentQuiz.content}
            choice={currentQuiz.choice}
            answer={currentQuiz.answer}
            isCorrect={isCorrect}
            commentary={currentQuiz.commentary}
            quizSessionId={quizSessionId}
            showAnswer={showAnswer}
            onNext={handleNextQuiz}
            isLastQuiz={currentQuizIndex === quizList.length - 1}
            onAnswerSelect={(answer) => setUserAnswer(answer)}
          />
        );
      case "OX":
        return (
          <OX
            content={currentQuiz.content}
            answer={currentQuiz.answer}
            isCorrect={isCorrect}
            commentary={currentQuiz.commentary}
            quizSessionId={quizSessionId}
            showAnswer={showAnswer}
            onNext={handleNextQuiz}
            isLastQuiz={currentQuizIndex === quizList.length - 1}
            onAnswerSelect={(answer) => setUserAnswer(answer)}
          />
        );
      case "OBJECTIVE":
        return (
          <Objective
            content={currentQuiz.content}
            answer={currentQuiz.answer}
            isCorrect={isCorrect}
            commentary={currentQuiz.commentary}
            quizSessionId={quizSessionId}
            showAnswer={showAnswer}
            onNext={handleNextQuiz}
            isLastQuiz={currentQuizIndex === quizList.length - 1}
            onAnswerSelect={(answer) => setUserAnswer(answer)}
          />
        );
      default:
        return <div>지원하지 않는 퀴즈 타입입니다.</div>;
    }
  };

  return (
    <div className="content-quiz mt-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mb-2 md:mb-4">
        <h1 className="text-[20px] md:text-[28px] font-pre-semibold text-main200 flex items-center gap-2 whitespace-nowrap min-w-0">
          <img src={small_logo} alt="logo" className="w-10 h-10 flex-shrink-0" />
          <span className="flex-shrink-0">Quiz :</span>
          <span className="text-normalactive truncate min-w-0">{collectionName}</span>
        </h1>
        {/* <button
          className="border border-red text-red rounded-lg p-1 flex items-center gap-2 transition-transform duration-200 hover:scale-110 w-full md:w-auto justify-center"
          onClick={handleExitQuiz}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 종료하기
        </button> */}
      </div>
      <div className="w-full h-[calc(100vh-56px-40px-80px)] bg-white rounded-xl shadow-xl px-4 md:px-8 py-2 md:py-4 relative">
        <div className="flex items-center justify-center mb-2 md:mb-4">
          <Progress currentQuizIndex={currentQuizIndex} totalQuizCount={quizList.length} />
        </div>
        <div className="h-[calc(100vh-56px-40px-80px-100px)] md:h-[calc(100vh-56px-40px-80px-120px)] overflow-y-auto">
          {currentQuiz && renderQuizComponent(currentQuiz)}
        </div>
        {!showAnswer && (
          <button
            className="text-main200 text-base md:text-20 font-pre-medium absolute bottom-2 md:bottom-4 right-4 md:right-8 flex items-center gap-1 transition-transform duration-200 hover:scale-110"
            onClick={handleShowAnswer}
          >
            <img src={nextIcon} alt="nextQuizIcon" className="w-5 h-5 md:w-6 md:h-6" />
            정답 보기
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizShowPersonalPage;
