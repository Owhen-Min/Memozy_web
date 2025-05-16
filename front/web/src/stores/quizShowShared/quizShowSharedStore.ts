import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QuizShowSharedStore } from "./types";

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
      }),
    }
  )
);
