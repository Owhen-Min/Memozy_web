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
interface QuizShowPersonalPageProps {
  collectionName: string;
  quizList: Quiz[];
  quizSessionId: string;
}

function QuizShowPersonalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const collectionId = useParams().collectionId;
  const { collectionName, quizList, quizSessionId } = location.state as QuizShowPersonalPageProps;
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

  const handleShowAnswer = () => {
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

    console.log("퀴즈 정보:", {
      quizId: currentQuizData.quizId,
      quizSessionId: quizSessionId,
      userAnswer: answerValue,
      isCorrect: isCorrect,
      correctAnswer: currentQuizData.answer,
    });

    setShowAnswer(true);
  };

  const renderQuizComponent = (currentQuiz: Quiz) => {
    if (!currentQuiz) return null;

    const handleNextQuiz = () => {
      setShowAnswer(false);
      setUserAnswer(null);
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuiz(quizList[currentQuizIndex + 1]);
      if (currentQuizIndex === quizList.length - 1) {
        navigate(`/quiz-result/personal/${collectionId}`, {
          state: {
            quizSessionId: quizSessionId,
          },
        });
      }
    };

    const isLastQuiz = currentQuizIndex === quizList.length - 1;

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
            isLastQuiz={isLastQuiz}
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
            isLastQuiz={isLastQuiz}
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
            isLastQuiz={isLastQuiz}
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
          onClick={() => navigate(`/collection/${collectionId}`)}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          컬렉션 리스트로 돌아가기
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
