import { useEffect } from "react";
import { Quiz } from "../../types/quizShow";
import { useQuizShowSharedStore } from "../../stores/quizShowShared/quizShowSharedStore";

interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

interface UseQuizShowSharedShowProps {
  quizCount: number;
  quizList: Quiz[];
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
    isTimerRunning,
    isCommentaryShow,
    answerTime,
    displayTime,
    currentQuizIndex,
    isShowEnded,
    quizzes,

    // 액션들
    setQuizzes,
    setQuizCount,
    setCollectionName,
    startInitialCountdown,
    handleOXSelect,
    handleMultipleChoiceSelect,
    handleObjectiveInput,
    checkAnswer,
    isAnswerCorrect,
    clearAllTimers,
  } = useQuizShowSharedStore();

  // 초기 퀴즈 데이터 및 설정 - 단 한번만 실행
  useEffect(() => {
    if (quizList.length > 0) {
      // 퀴즈 데이터 설정
      setQuizzes(quizList);
      setQuizCount(quizCount);
      setCollectionName(collectionName);

      // 타이머 시작 (타이머 관련 로직은 store에서 관리)
      startInitialCountdown();
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearAllTimers();
    };
  }, [
    quizList,
    quizCount,
    collectionName,
    setQuizzes,
    setQuizCount,
    setCollectionName,
    startInitialCountdown,
    clearAllTimers,
  ]);

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
    isCommentaryShow,
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
