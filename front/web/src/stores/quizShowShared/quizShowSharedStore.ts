import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QuizShowSharedStore } from "./types";
import { Quiz } from "../../types/quizShow";

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
  isTimerRunning: false,
  isCommentaryShow: false,
  answerTime: 0,
  displayTime: 30,
};

export const useQuizShowSharedStore = create<QuizShowSharedStore>()(
  persist(
    (set) => ({
      ...initialState,

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
      setQuizSessionId: (quizSessionId) => set({ quizSessionId }),
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
      setIsCommentaryShow: (isCommentaryShow) => set({ isCommentaryShow }),
      setAnswerTime: (answerTime) => set({ answerTime }),
      setDisplayTime: (displayTime) => set({ displayTime }),

      addQuiz: (quiz, index) =>
        set((state) => {
          const newQuizzes = [...state.quizzes];
          newQuizzes[index] = quiz;
          return { quizzes: newQuizzes };
        }),

      resetStore: () => set(initialState),
    }),
    {
      name: "quiz-show-shared-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isShowStarted: state.isShowStarted,
        isShowEnded: state.isShowEnded,
        isHost: state.isHost,
        isLoading: state.isLoading,
        quizCount: state.quizCount,
        collectionName: state.collectionName,
        participants: state.participants,
        nickname: state.nickname,
        hostId: state.hostId,
        userId: state.userId,
        currentQuizIndex: state.currentQuizIndex,
        quizSessionId: state.quizSessionId,
        quizzes: state.quizzes,
        myResult: state.myResult,
        result: state.result,
        isResultReady: state.isResultReady,
        currentQuiz: state.currentQuiz,
        showAnswer: state.showAnswer,
        userAnswer: state.userAnswer,
        selectedOX: state.selectedOX,
        selectedMultipleChoice: state.selectedMultipleChoice,
        objectiveInput: state.objectiveInput,
        loadingCount: state.loadingCount,
        timeLeft: state.timeLeft,
        isTimerRunning: state.isTimerRunning,
        isCommentaryShow: state.isCommentaryShow,
        answerTime: state.answerTime,
        displayTime: state.displayTime,
      }),
    }
  )
);
