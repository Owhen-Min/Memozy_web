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
    clearAllTimers,
  } = useQuizShowSharedStore();

  // 초기 퀴즈 데이터 설정 useEffect
  useEffect(() => {
    console.log("[DEBUG-HOOK] 초기 데이터 설정 useEffect 실행", {
      quizListLength: quizList.length,
      quizCount,
      isInitialized,
    });

    if (quizList.length > 0) {
      // 퀴즈 데이터 설정 (초기화만 수행)
      initQuizData(quizList, quizCount, collectionName);

      // 초기화되지 않은 경우에만 카운트다운 시작
      if (!isInitialized) {
        console.log("[DEBUG-HOOK] 초기 카운트다운 시작");
        setTimeout(() => {
          startCountdown();
        }, 0);
      }
    }

    // 리렌더링으로 인한 useEffect 클린업에서는 타이머를 클리어하지 않습니다.
    // 언마운트 부분은 컴포넌트 완전 제거 시에만 호출되도록 별도 처리합니다.

    return () => {
      // 컴포넌트 언마운트 시 작업
      console.log("[DEBUG-HOOK] 컴포넌트 클린업 호출");

      // 기록만 하고 타이머는 여기서 정리하지 않음
      isUnmounting = true;
    };
  }, [quizList, quizCount, collectionName, initQuizData, startCountdown, isInitialized]);

  // 쇼가 종료되었는지 확인하고 처리
  useEffect(() => {
    if (isShowEnded) {
      console.log("[DEBUG-HOOK] 쇼 종료 감지, handleShowEnded 호출");
      handleShowEnded();
    }
  }, [isShowEnded, handleShowEnded]);

  // beforeunload 이벤트를 위한 별도 useEffect
  useEffect(() => {
    // 페이지 언로드 시에만 타이머 정리를 위한 핸들러
    const handleBeforeUnload = () => {
      console.log("[DEBUG-HOOK] 페이지 언로드 감지, 타이머 정리");
      clearAllTimers();
    };

    // 페이지 언로드 이벤트 리스너 등록
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // 이벤트 리스너 정리
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [clearAllTimers]);

  // 정답 확인 함수 (사용자 액션에 의해 호출됨)
  const handleShowAnswer = () => {
    console.log("[DEBUG-HOOK] handleShowAnswer 호출", { userAnswer });
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
