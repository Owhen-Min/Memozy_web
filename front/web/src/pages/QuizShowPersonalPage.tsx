import { useLocation, useNavigate, useParams } from "react-router";
import small_logo from "../assets/images/small_logo.png";
import { Quiz } from "../types/quizShow";
import { useState, useEffect } from "react";
import MultipleChoice from "../components/quizShowPage/MultipleChoice";
import OX from "../components/quizShowPage/OX";
import Objective from "../components/quizShowPage/Objective";
import Progress from "../components/quizShowPage/Progress";
import outQuizShowIcon from "../assets/icons/outQuizShowIcon.svg";
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
    // 데이터가 없으면 컬렉션 페이지로 리다이렉트
    navigate(`/collection/${collectionId}`);
    return { collectionName: "", quizList: [], quizSessionId: "" };
  });

  const { collectionName, quizList, quizSessionId } = quizData;
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 브라우저 기본 확인 대화상자 표시
      e.preventDefault();
      e.returnValue = "진행 중인 퀴즈 쇼가 종료됩니다. 정말로 나가시겠습니까?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 퀴즈 쇼 종료 시 로컬 스토리지 데이터 삭제
  const handleExitQuiz = () => {
    if (window.confirm("퀴즈 진행 중입니다. 정말로 종료하시겠습니까?")) {
      localStorage.removeItem(`quiz_data_${collectionId}`);
      navigate(`/collection/${collectionId}`);
    }
  };

  // 퀴즈 완료 시 로컬 스토리지 데이터 삭제
  const handleNextQuiz = () => {
    setShowAnswer(false);
    setUserAnswer(null);
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
    const handlePopState = (e: PopStateEvent) => {
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
    let isCorrect = false;
    let answerValue = "";

    if (typeof userAnswer === "object" && "value" in userAnswer) {
      // 객관식 답변
      answerValue = userAnswer.value;
      // 정답이 보기 내용인 경우
      isCorrect = currentQuizData.answer === answerValue;
    } else {
      // OX, 주관식 답변
      answerValue = userAnswer.toString();
      isCorrect = currentQuizData.answer === answerValue;
    }

    try {
      await submitAnswer(currentQuizData.quizId, answerValue, isCorrect);
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
    <div className="content-quiz">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
          <img src={small_logo} alt="logo" className="w-10 h-10" />
          Quiz : <span className="text-normalactive">{collectionName}</span>
        </h1>
        <button
          className="border border-red text-red rounded-lg p-2 flex items-center gap-2 transition-transform duration-200 hover:scale-110"
          onClick={handleExitQuiz}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 종료하기
        </button>
      </div>
      <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl px-8 py-4 relative">
        <div className="flex items-center justify-center">
          <Progress currentQuizIndex={currentQuizIndex} totalQuizCount={quizList.length} />
        </div>
        {currentQuiz && renderQuizComponent(currentQuiz)}
        {!showAnswer && (
          <button
            className="text-main200 text-20 font-pre-medium absolute bottom-4 right-8 flex items-center gap-1 transition-transform duration-200 hover:scale-110"
            onClick={handleShowAnswer}
          >
            <img src={nextIcon} alt="nextQuizIcon" className="w-6 h-6" />
            정답 보기
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizShowPersonalPage;
