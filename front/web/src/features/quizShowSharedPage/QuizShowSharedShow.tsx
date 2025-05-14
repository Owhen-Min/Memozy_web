import small_logo from "../../assets/images/small_logo.png";
import { Quiz } from "../../types/quizShow";
import { useState, useEffect } from "react";
import MultipleChoice from "../../components/quizShowPage/MultipleChoice";
import OX from "../../components/quizShowPage/OX";
import Objective from "../../components/quizShowPage/Objective";
import outQuizShowIcon from "../../assets/icons/outQuizShowIcon.svg";
import nextIcon from "../../assets/icons/nextIcon.svg";

interface Answer {
  type: "SUBMIT";
  index: number;
  answer: string;
  isCorrect: boolean;
}

interface QuizShowSharedShowProps {
  quizCount: number;
  quizList: Quiz[];
  quizSessionId: string;
  collectionName: string;
  currentQuizIndex: number;
  setCurrentQuizIndex: (index: number) => void;
  setIsShowEnded: (isEnded: boolean) => void;
  submitAnswer: (answer: Answer) => void;
}

function QuizShowSharedShow({
  quizCount,
  quizList,
  quizSessionId,
  collectionName,
  currentQuizIndex,
  setCurrentQuizIndex,
  setIsShowEnded,
  submitAnswer,
}: QuizShowSharedShowProps) {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<
    string | number | { index: number; value: string } | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20); // 20초 타이머
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCommentaryShow, setIsCommentaryShow] = useState(false);

  useEffect(() => {
    if (quizList.length > 0) {
      const timer = setTimeout(() => {
        setCurrentQuiz(quizList[0]);
        setIsLoading(false);
        setIsTimerRunning(true); // 퀴즈 로딩 후 타이머 시작
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [quizList]);

  // 타이머 로직
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleNextQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTimerRunning, timeLeft]);

  // 해설 표시 로직 - 10초 후 자동으로 해설 표시
  useEffect(() => {
    if (!isTimerRunning || isCommentaryShow) return;

    const commentaryTimer = setTimeout(() => {
      setIsCommentaryShow(true);
    }, 10000); // 10초 후 해설 표시

    return () => clearTimeout(commentaryTimer);
  }, [isTimerRunning, isCommentaryShow]);

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

    // 정답 제출
    submitAnswer({
      type: "SUBMIT",
      index: currentQuizIndex,
      answer: answerValue,
      isCorrect: isCorrect,
    });

    setIsCommentaryShow(true); // 선택 완료 시 해설 표시
  };

  const renderQuizComponent = (currentQuiz: Quiz) => {
    if (!currentQuiz) return null;

    const isLastQuiz = currentQuizIndex === quizCount - 1;

    // 빈 함수를 전달하여 onNext prop 오류 해결
    const emptyNextHandler = () => {};

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
            isLastQuiz={isLastQuiz}
            onNext={emptyNextHandler}
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
            isLastQuiz={isLastQuiz}
            onNext={emptyNextHandler}
            onAnswerSelect={(answer) => setUserAnswer(answer)}
          />
        );
      default:
        return <div>지원하지 않는 퀴즈 타입입니다.</div>;
    }
  };

  // 다음 문제로 이동하는 함수
  const handleNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;

    setShowAnswer(false);
    setUserAnswer(null);
    setCurrentQuizIndex(nextIndex);
    setCurrentQuiz(quizList[nextIndex]);
    setTimeLeft(20); // 타이머 리셋
    setIsTimerRunning(true); // 타이머 다시 시작
    setIsCommentaryShow(false); // 해설 숨기기
    if (nextIndex >= quizCount) {
      // 마지막 퀴즈 이후 종료 처리
      setIsShowEnded(true);
      return;
    }
  };

  // 표시할 타이머 시간 계산
  const [displayTime, setDisplayTime] = useState(timeLeft);

  useEffect(() => {
    if (isCommentaryShow) {
      setDisplayTime(timeLeft);
    } else {
      setDisplayTime(Math.max(0, timeLeft - 10));
    }
  }, [isCommentaryShow, timeLeft]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
          <img src={small_logo} alt="logo" className="w-10 h-10" />
          Quiz : <span className="text-normalactive">{collectionName}</span>
        </h1>
        <button
          className="border border-red text-red rounded-lg p-2 flex items-center gap-2 transition-transform duration-200 hover:scale-110"
          onClick={() => (window.location.href = "/collection")}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 나가기
        </button>
      </div>
      <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl px-8 py-4 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-2xl font-pre-medium text-main200">
              잠시 후 퀴즈가 시작됩니다...
            </div>
          </div>
        ) : (
          <>
            {/* 타이머 표시 영역 */}
            <div className="absolute top-5 right-5 flex items-center">
              <div className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" />
                </svg>
                {displayTime}초
              </div>
            </div>

            {/* 타이머 진행 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${(displayTime / (isCommentaryShow ? 20 : 10)) * 100}%` }}
              ></div>
            </div>

            {/* 퀴즈 컴포넌트 */}
            {currentQuiz && renderQuizComponent(currentQuiz)}

            {/* 해설 영역 */}
            {isCommentaryShow && currentQuiz && (
              <div className="absolute bottom-0 left-0 right-0 bg-pink-100 p-4 rounded-b-xl">
                <div className="text-lg font-bold mb-2">해설</div>
                <p className="text-gray-800">{currentQuiz.commentary || currentQuiz.answer}</p>
              </div>
            )}

            {/* 정답 보기 버튼 */}
            {!isCommentaryShow && (
              <button
                className="text-main200 text-20 font-pre-medium absolute bottom-4 right-8 flex items-center gap-1 transition-transform duration-200 hover:scale-110"
                onClick={handleShowAnswer}
              >
                <img src={nextIcon} alt="nextQuizIcon" className="w-6 h-6" />
                선택 완료
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default QuizShowSharedShow;
