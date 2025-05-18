import { useEffect, useCallback } from "react";
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
  currentQuizIndex: number;
  setCurrentQuizIndex: (index: number) => void;
  handleShowEnded: () => void;
  submitAnswer: (answer: Answer) => void;
}

export const useQuizShowSharedShow = ({
  quizCount,
  quizList,
  currentQuizIndex,
  setCurrentQuizIndex,
  handleShowEnded,
  submitAnswer,
}: UseQuizShowSharedShowProps) => {
  const {
    currentQuiz,
    setCurrentQuiz,
    showAnswer,
    setShowAnswer,
    userAnswer,
    setUserAnswer,
    selectedOX,
    setSelectedOX,
    selectedMultipleChoice,
    setSelectedMultipleChoice,
    objectiveInput,
    setObjectiveInput,
    loadingCount,
    setLoadingCount,
    timeLeft,
    setTimeLeft,
    isTimerRunning,
    setIsTimerRunning,
    isCommentaryShow,
    setIsCommentaryShow,
    answerTime,
    setAnswerTime,
    displayTime,
    setDisplayTime,
  } = useQuizShowSharedStore();

  // 초기 로딩 및 카운트다운
  useEffect(() => {
    if (quizList.length > 0) {
      // 카운트다운 시작
      const countdownInterval = setInterval(() => {
        setLoadingCount((prev: number) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timer = setTimeout(() => {
        setCurrentQuiz(quizList[0]);
        setIsTimerRunning(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [quizList, setCurrentQuiz, setLoadingCount, setIsTimerRunning]);

  // 다음 문제로 이동하는 함수
  const handleNextQuiz = useCallback(() => {
    const nextIndex = currentQuizIndex + 1;
    setShowAnswer(false);
    setUserAnswer(null);
    setSelectedOX(null);
    setSelectedMultipleChoice(null);
    setObjectiveInput("");

    setCurrentQuizIndex(nextIndex);
    setCurrentQuiz(quizList[nextIndex]);
    setTimeLeft(30); // 타이머 리셋
    setIsTimerRunning(true); // 타이머 다시 시작
    setIsCommentaryShow(false); // 해설 숨기기

    if (nextIndex >= quizCount) {
      // 마지막 퀴즈 이후 종료 처리
      handleShowEnded();
      return;
    }
  }, [
    currentQuizIndex,
    quizCount,
    quizList,
    setCurrentQuizIndex,
    handleShowEnded,
    setShowAnswer,
    setUserAnswer,
    setSelectedOX,
    setSelectedMultipleChoice,
    setObjectiveInput,
    setCurrentQuiz,
    setTimeLeft,
    setIsTimerRunning,
    setIsCommentaryShow,
  ]);

  // 타이머 로직
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleNextQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isTimerRunning, timeLeft, handleNextQuiz, setTimeLeft]);

  // 해설 표시 로직 - 10초 후 자동으로 해설 표시
  useEffect(() => {
    if (!isTimerRunning || isCommentaryShow) return;

    const commentaryTimer = setTimeout(() => {
      setIsCommentaryShow(true);
      setAnswerTime(Math.max(answerTime, 10));
    }, 20000); // 20초 후 해설 표시

    return () => clearTimeout(commentaryTimer);
  }, [isTimerRunning, isCommentaryShow, answerTime, setIsCommentaryShow, setAnswerTime]);

  // 표시할 타이머 시간 계산
  useEffect(() => {
    if (isCommentaryShow) {
      setDisplayTime(timeLeft);
    } else {
      setDisplayTime(Math.max(0, timeLeft - 10));
    }
  }, [isCommentaryShow, timeLeft, setDisplayTime]);

  // OX 선택 핸들러
  const handleOXSelect = (value: "O" | "X") => {
    setSelectedOX(value);
    setUserAnswer(value);
  };

  // 객관식 선택 핸들러
  const handleMultipleChoiceSelect = (answer: { index: number; value: string }) => {
    setSelectedMultipleChoice(answer.index - 1);
    setUserAnswer(answer);
  };

  // 주관식 입력 핸들러
  const handleObjectiveInput = (value: string) => {
    setObjectiveInput(value);
    setUserAnswer(value);
  };

  // 정답 확인 함수
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
      choice: answerValue,
      isCorrect: isCorrect,
    });

    setShowAnswer(true);
    setIsCommentaryShow(true);
    setAnswerTime(timeLeft);
  };

  // 정답 확인 함수
  const checkAnswerCorrect = () => {
    if (!showAnswer || userAnswer === null || !currentQuiz) return undefined;

    let answerValue = "";
    if (typeof userAnswer === "object" && "value" in userAnswer) {
      // 객관식 답변
      answerValue = userAnswer.value;
    } else {
      // OX, 주관식 답변
      answerValue = userAnswer.toString();
    }

    return currentQuiz.answer === answerValue;
  };

  return {
    currentQuiz,
    answerTime,
    showAnswer,
    isLoading: loadingCount > 0,
    loadingCount,
    timeLeft,
    displayTime,
    isCommentaryShow,
    selectedOX,
    selectedMultipleChoice,
    objectiveInput,
    handleOXSelect,
    handleMultipleChoiceSelect,
    handleObjectiveInput,
    handleShowAnswer,
    handleNextQuiz,
    checkAnswerCorrect,
  };
};
