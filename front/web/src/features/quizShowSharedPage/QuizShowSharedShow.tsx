import small_logo from "../../assets/images/small_logo.png";
import { Quiz } from "../../types/quizShow";
import { useQuizShowSharedShow } from "../../hooks/sharedQuizShow";
import MultipleChoice from "../../components/quizShowSharedPage/MultipleChoice";
import OX from "../../components/quizShowSharedPage/OX";
import Objective from "../../components/quizShowSharedPage/Objective";
import outQuizShowIcon from "../../assets/icons/outQuizShowIcon.svg";
import nextIcon from "../../assets/icons/nextIcon.svg";
import { useNavigate } from "react-router";

interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

interface QuizShowSharedShowProps {
  quizCount: number;
  quizList: Quiz[];
  quizSessionId: string;
  collectionName: string;
  handleShowEnded: () => void;
  submitAnswer: (answer: Answer) => void;
}

function QuizShowSharedShow({
  quizCount,
  quizList,
  collectionName,
  handleShowEnded,
  submitAnswer,
}: QuizShowSharedShowProps) {
  const {
    currentQuiz,
    showAnswer,
    isLoading,
    answerTime,
    loadingCount,
    displayTime,
    selectedOX,
    selectedMultipleChoice,
    objectiveInput,
    handleOXSelect,
    handleMultipleChoiceSelect,
    handleObjectiveInput,
    handleShowAnswer,
    checkAnswerCorrect,
  } = useQuizShowSharedShow({
    quizCount,
    quizList,
    collectionName,
    handleShowEnded,
    submitAnswer,
  });
  const navigate = useNavigate();

  const renderQuizComponent = (currentQuiz: Quiz) => {
    if (!currentQuiz) return null;

    // 사용자 답변이 정답인지 체크
    const isCorrect = checkAnswerCorrect();

    switch (currentQuiz.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoice
            content={currentQuiz.content}
            choice={currentQuiz.choice}
            answer={currentQuiz.answer}
            showAnswer={showAnswer}
            onAnswerSelect={handleMultipleChoiceSelect}
            isCorrect={isCorrect}
            selected={selectedMultipleChoice}
          />
        );
      case "OX":
        return (
          <OX
            content={currentQuiz.content}
            answer={currentQuiz.answer}
            showAnswer={showAnswer}
            onAnswerSelect={handleOXSelect}
            isCorrect={isCorrect}
            selected={selectedOX}
          />
        );
      case "OBJECTIVE":
        return (
          <Objective
            content={currentQuiz.content}
            answer={currentQuiz.answer}
            showAnswer={showAnswer}
            onAnswerSelect={handleObjectiveInput}
            isCorrect={isCorrect}
            inputValue={objectiveInput}
          />
        );
      default:
        return <div>지원하지 않는 퀴즈 타입입니다.</div>;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex text-[28px] font-pre-semibold text-main200 flex items-center gap-1">
          <img src={small_logo} alt="logo" className="h-full" />
          <span
            className="h-full break-all line-clamp-1 relative text-normalactive"
            title={`${collectionName}`}
          >
            {collectionName}
          </span>
        </div>
        <button
          className="flex-shrink-0 border border-red text-red rounded-lg p-2 flex items-center gap-2 text-12 w-100"
          onClick={() => navigate(`/collection`)}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 나가기
        </button>
      </div>
      <div className="w-full h-[85vh] bg-white rounded-xl shadow-xl px-8 py-4 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl font-pre-bold text-main200 mb-4 animate-bounce">
                {loadingCount} 초
              </div>
              <div className="text-2xl font-pre-medium text-main200">
                {loadingCount > 0 ? `잠시 후 퀴즈가 시작됩니다...` : "퀴즈를 시작합니다!"}
              </div>
              <div className="mt-4">
                <div className="w-16 h-16 border-4 border-main200 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 타이머 진행 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  showAnswer ? "bg-green-600" : "bg-blue-600"
                }`}
                style={{
                  width: `${Math.max(0, (displayTime / (showAnswer ? answerTime : 20)) * 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex relative items-center justify-end">
              <div className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" />
                </svg>
                {displayTime}초
              </div>
            </div>

            {/* 퀴즈 컴포넌트 */}
            {currentQuiz && renderQuizComponent(currentQuiz)}

            {/* 해설 영역 */}
            {showAnswer && currentQuiz && (
              <div className="flex flex-col justify-center items-start bg-pink-100 mt-3 px-4 py-2 rounded-xl">
                <p className="text-20 sm:text-24 font-bold mb-2">해설</p>
                <p className="text-16 sm:text-20 text-gray-800">
                  {currentQuiz.commentary || currentQuiz.answer}
                </p>
              </div>
            )}

            {/* 정답 제출 버튼 - 정답 제출 전에만 표시 */}
            {!showAnswer && (
              <div className="flex justify-end items-center mt-2 sm:mt-8">
                <button
                  className="text-main200 text-20 font-pre-medium flex gap-1 transition-transform duration-200 hover:scale-110"
                  onClick={handleShowAnswer}
                >
                  <img src={nextIcon} alt="nextQuizIcon" className="w-6 h-6" />
                  선택 완료
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default QuizShowSharedShow;
