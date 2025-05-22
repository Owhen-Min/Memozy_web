import { useEffect } from "react";
import { QuizShared } from "../../types/quizShow";
import { useQuizShowSharedStore } from "../../stores/quizShowShared/quizShowSharedStore";

interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

interface UseQuizShowSharedShowProps {
  quizCount: number;
  quizList: QuizShared[];
  collectionName: string;
  handleShowEnded: () => void;
  submitAnswer: (answer: Answer) => void;
}

export const useQuizShowSharedShow = ({
  quizCount,
  quizList,
  collectionName,
  handleShowEnded,
  submitAnswer,
}: UseQuizShowSharedShowProps) => {
  const {
    // 상태들
    currentQuiz,
    showAnswer,
    userAnswer,
    selectedOX,
    selectedMultipleChoice,
    objectiveInput,
    loadingCount,
    timeLeft,
    answerTime,
    displayTime,
    currentQuizIndex,
    isShowEnded,
    isInitialized,

    // 액션들
    initQuizData,
    startCountdown,
    handleOXSelect,
    handleMultipleChoiceSelect,
    handleObjectiveInput,
    checkAnswer,
    isAnswerCorrect,
  } = useQuizShowSharedStore();

  // 초기 퀴즈 데이터 설정 useEffect
  useEffect(() => {
    if (quizList.length > 0) {
      // 퀴즈 데이터 설정 (초기화만 수행)
      initQuizData(quizList, quizCount, collectionName);

      // 초기화되지 않은 경우에만 카운트다운 시작
      if (!isInitialized) {
        setTimeout(() => {
          startCountdown();
        }, 0);
      }
    }

    return () => {
      // 컴포넌트 언마운트 시 작업
    };
  }, [quizList, quizCount, collectionName, initQuizData, startCountdown, isInitialized]);

  // 쇼가 종료되었는지 확인하고 처리
  useEffect(() => {
    if (isShowEnded) {
      handleShowEnded();
    }
  }, [isShowEnded, handleShowEnded]);

  // 정답 확인 함수 (사용자 액션에 의해 호출됨)
  const handleShowAnswer = () => {
    if (userAnswer === null) {
      alert("답을 선택해주세요!");
      return;
    }

    // store의 checkAnswer 함수 호출하고 submitAnswer 콜백 전달
    checkAnswer(submitAnswer);
  };

  return {
    // 현재 상태 반환
    currentQuiz,
    currentQuizIndex,
    showAnswer,
    isLoading: loadingCount > 0,
    loadingCount,
    timeLeft,
    displayTime,
    answerTime,
    selectedOX,
    selectedMultipleChoice,
    objectiveInput,

    // 핸들러 반환
    handleOXSelect,
    handleMultipleChoiceSelect,
    handleObjectiveInput,
    handleShowAnswer,
    checkAnswerCorrect: isAnswerCorrect,
  };
};
