import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Quiz } from "../../types/quizShow";
import { QuizShowSharedStore, User, QuizShowMyResult, QuizShowResult, Answer } from "./types";
import { createDelayedSessionStorage } from "../utils/sessionStorage";

// 초기 상태
const initialState = {
  isLoading: true,
  isShowStarted: false,
  isShowEnded: false,
  isHost: false,
  quizCount: 0,
  collectionName: "",
  participants: [],
  nickname: "",
  hostId: "",
  userId: "",
  currentQuizIndex: 0,
  quizSessionId: "",
  quizzes: [],
  myResult: {},
  result: {},
  isResultReady: false,
  currentQuiz: null as Quiz | null,
  showAnswer: false,
  userAnswer: null as string | number | { index: number; value: string } | null,
  selectedOX: null as "O" | "X" | null,
  selectedMultipleChoice: null as number | null,
  objectiveInput: "",
  loadingCount: 3,
  timeLeft: 30,
  displayTime: 20,
  isTimerRunning: false,
  answerTime: 0,
  isInitialized: false,
  isFirstStart: true,
  timers: {
    countdownTimer: null as any | null,
    quizTimer: null as any | null,
    commentaryTimer: null as any | null,
  },
};

// 실제 스토어 생성
export const useQuizShowStore = create<QuizShowSharedStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 기본 상태 설정 액션들
      setQuizSessionIdInternal: (id: string) => set({ quizSessionId: id }),
      setQuizSessionId: (id: string) => set({ quizSessionId: id }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsShowStarted: (isShowStarted) => set({ isShowStarted }),
      setIsShowEnded: (isShowEnded) => set({ isShowEnded }),
      setIsHost: (isHost) => set({ isHost }),
      setQuizCount: (quizCount) => set({ quizCount }),
      setCollectionName: (collectionName) => set({ collectionName }),
      setParticipants: (participants) => set({ participants }),
      setNickname: (nickname) => set({ nickname }),
      setHostId: (hostId) => set({ hostId }),
      setUserId: (userId) => set({ userId }),
      setCurrentQuizIndex: (currentQuizIndex) => set({ currentQuizIndex }),
      setQuizzes: (quizzes) => set({ quizzes }),
      setMyResult: (myResult) => set({ myResult }),
      setResult: (result) => set({ result }),
      setIsResultReady: (isResultReady) => set({ isResultReady }),
      setCurrentQuiz: (currentQuiz) => set({ currentQuiz }),
      setShowAnswer: (showAnswer) => set({ showAnswer }),
      setUserAnswer: (userAnswer) => set({ userAnswer }),
      setSelectedOX: (selectedOX) => set({ selectedOX }),
      setSelectedMultipleChoice: (selectedMultipleChoice) => set({ selectedMultipleChoice }),
      setObjectiveInput: (objectiveInput) => set({ objectiveInput }),
      setLoadingCount: (loadingCount) =>
        set((state) => ({
          loadingCount:
            typeof loadingCount === "function"
              ? loadingCount(state.loadingCount || 0)
              : loadingCount,
        })),
      setTimeLeft: (timeLeft) =>
        set((state) => ({
          timeLeft: typeof timeLeft === "function" ? timeLeft(state.timeLeft) : timeLeft,
        })),
      setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),

      // 퀴즈 추가 액션
      addQuiz: (quiz, index) =>
        set((state) => {
          const newQuizzes = [...state.quizzes];
          newQuizzes[index] = quiz;
          return { quizzes: newQuizzes };
        }),

      // 스토어 리셋
      resetStore: () => {
        set({
          ...initialState,
          isInitialized: false,
          isFirstStart: true,
        });
        get().clearAllTimers();
      },

      // 아래 메서드들은 hooks에서 구현하여 주입할 것임
      // 여기서는 인터페이스 만족을 위한 플레이스홀더로 작성
      clearAllTimers: () => {},
      startInitialCountdown: () => {},
      startQuizTimer: () => {},
      handleOXSelect: () => {},
      handleMultipleChoiceSelect: () => {},
      handleObjectiveInput: () => {},
      moveToNextQuiz: () => {},
      checkAnswer: () => false,
      isAnswerCorrect: () => undefined,
      initQuizData: () => {},
      startCountdown: () => {},
      autoSubmitAnswer: () => undefined,
    }),
    {
      name: "quiz-show-shared-storage",
      storage: createJSONStorage(() => createDelayedSessionStorage()),
      partialize: (state): Partial<QuizShowSharedStore> => ({
        quizSessionId: state.quizSessionId,
        hostId: state.hostId,
        userId: state.userId,
        isHost: state.isHost,
        nickname: state.nickname,
        participants: state.participants,
        isShowStarted: state.isShowStarted,
        isShowEnded: state.isShowEnded,
        quizCount: state.quizCount,
        collectionName: state.collectionName,
        currentQuizIndex: state.currentQuizIndex,
        quizzes: state.quizzes,
        currentQuiz: state.currentQuiz,
        showAnswer: state.showAnswer,
        userAnswer: state.userAnswer,
        selectedOX: state.selectedOX,
        selectedMultipleChoice: state.selectedMultipleChoice,
        objectiveInput: state.objectiveInput,
        answerTime: state.answerTime,
        displayTime: state.displayTime,
        isResultReady: state.isResultReady,
        result: state.result,
        myResult: state.myResult,
        isInitialized: state.isInitialized,
        isFirstStart: state.isFirstStart,
        isTimerRunning: state.isTimerRunning,
        timeLeft: state.timeLeft,
      }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("[DEBUG] 상태 복원 중 오류 발생:", error);
          } else {
            if (state?.isInitialized && state?.isShowStarted && !state.isShowEnded) {
              setTimeout(() => {
                useQuizShowStore.getState().startCountdown();
              }, 100);
            }
          }
        };
      },
    }
  )
);
