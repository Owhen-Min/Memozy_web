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
  timers: {
    countdownTimer: null as any | null,
    quizTimer: null as any | null,
    commentaryTimer: null as any | null,
  },
};

// 세션 ID를 기다리는 Promise를 반환하는 함수
const getSessionIdWhenReady = (retryInterval = 100, maxRetries = 50): Promise<string | null> => {
  return new Promise((resolve) => {
    let retries = 0;
    const checkSessionId = () => {
      const id = sessionStorage.getItem("current-session-id");
      if (id) {
        resolve(id);
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(checkSessionId, retryInterval);
      } else {
        console.error("[STORAGE] 세션 ID를 가져오는데 실패했습니다 (최대 재시도 도달).");
        resolve(null);
      }
    };
    checkSessionId();
  });
};

// createJSONStorage에 전달될 커스텀 StateStorage (이름 변경 및 인터페이스 준수)
const delayedSessionStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const sessionId = await getSessionIdWhenReady();
    if (!sessionId) {
      console.warn(`[DELAYED_STORAGE] getItem: 세션 ID 사용 불가, ${name} 로드 실패.`);
      return null;
    }
    const suffixedName = `${name}-${sessionId}`;
    return sessionStorage.getItem(suffixedName);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const sessionId = await getSessionIdWhenReady();
    if (!sessionId) {
      console.warn(`[DELAYED_STORAGE] setItem: 세션 ID 사용 불가, ${name} 저장 실패.`);
      return;
    }
    const suffixedName = `${name}-${sessionId}`;
    // console.log(`[DELAYED_STORAGE] setItem for key: ${suffixedName} with value: ${value}`);
    sessionStorage.setItem(suffixedName, value);
  },
  removeItem: async (name: string): Promise<void> => {
    const sessionId = await getSessionIdWhenReady();
    if (!sessionId) {
      console.warn(`[DELAYED_STORAGE] removeItem: 세션 ID 사용 불가, ${name} 삭제 실패.`);
      return;
    }
    const suffixedName = `${name}-${sessionId}`;
    // console.log(`[DELAYED_STORAGE] removeItem for key: ${suffixedName}`);
    sessionStorage.removeItem(suffixedName);
  },
};

export const useQuizShowSharedStore = create<QuizShowSharedStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setQuizSessionIdInternal: (id: string) => set({ quizSessionId: id }),
      setQuizSessionId: (id: string) => {
        set({ quizSessionId: id });
      },

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
      setIsCommentaryShow: (isCommentaryShow) => set({ isCommentaryShow }),
      setAnswerTime: (answerTime) => set({ answerTime }),
      setDisplayTime: (displayTime) => set({ displayTime }),

      addQuiz: (quiz, index) =>
        set((state) => {
          const newQuizzes = [...state.quizzes];
          newQuizzes[index] = quiz;
          return { quizzes: newQuizzes };
        }),

      clearAllTimers: () => {
        const { timers } = get();
        if (timers.countdownTimer) clearInterval(timers.countdownTimer);
        if (timers.quizTimer) clearInterval(timers.quizTimer);
        if (timers.commentaryTimer) clearTimeout(timers.commentaryTimer);
        set({ timers: { countdownTimer: null, quizTimer: null, commentaryTimer: null } });
      },

      startInitialCountdown: () => {
        const { clearAllTimers, quizzes, currentQuizIndex: cqIndex, isTimerRunning: itr } = get();
        clearAllTimers();
        if (quizzes.length > 0) {
          if (get().isShowStarted && !get().isShowEnded && (cqIndex > 0 || itr)) {
            console.log("[LOGIC] 기존 퀴즈 진행 상태에서 카운트다운 재시작 시도", { cqIndex, itr });
            set({ currentQuiz: quizzes[cqIndex], isTimerRunning: true, loadingCount: 0 });
            get().startQuizTimer();
            return;
          }
          console.log("[LOGIC] 새로운 카운트다운 시작");
          set({ loadingCount: 3 });
          const countdownInterval = setInterval(() => {
            set((state) => {
              const newLoadingCount = state.loadingCount <= 1 ? 0 : state.loadingCount - 1;
              if (newLoadingCount <= 0) {
                if (state.timers.countdownTimer) clearInterval(state.timers.countdownTimer);
                setTimeout(() => {
                  set({ currentQuiz: state.quizzes[0], isTimerRunning: true });
                  get().startQuizTimer();
                }, 0);
              }
              return {
                loadingCount: newLoadingCount,
                timers: {
                  ...state.timers,
                  countdownTimer: newLoadingCount > 0 ? state.timers.countdownTimer : null,
                },
              };
            });
          }, 1000);
          set((state) => ({
            timers: { ...state.timers, countdownTimer: countdownInterval as any },
          }));
        }
      },

      startQuizTimer: () => {
        const { clearAllTimers } = get();
        clearAllTimers();
        set({ timeLeft: 30, isTimerRunning: true });
        const timerInterval = setInterval(() => {
          set((state) => {
            const newTimeLeft = state.timeLeft <= 1 ? 0 : state.timeLeft - 1;
            if (newTimeLeft <= 0) {
              if (state.timers.quizTimer) clearInterval(state.timers.quizTimer);
              if (!state.showAnswer) {
                /* 시간 초과 처리 */
              }
              setTimeout(() => get().moveToNextQuiz(), 3000);
              return {
                timeLeft: 0,
                timers: { ...state.timers, quizTimer: null },
                isTimerRunning: false,
              };
            }
            if (state.timeLeft === 11 && newTimeLeft === 10 && !state.isCommentaryShow) {
              set({ isCommentaryShow: true, answerTime: state.timeLeft - 10 });
            }
            const newDisplayTime = state.isCommentaryShow
              ? newTimeLeft
              : Math.max(0, newTimeLeft - 10);
            return { timeLeft: newTimeLeft, displayTime: newDisplayTime };
          });
        }, 1000);
        set((state) => ({ timers: { ...state.timers, quizTimer: timerInterval as any } }));
      },

      handleOXSelect: (value: "O" | "X") => set({ selectedOX: value, userAnswer: value }),
      handleMultipleChoiceSelect: (answer: { index: number; value: string }) =>
        set({ selectedMultipleChoice: answer.index - 1, userAnswer: answer }),
      handleObjectiveInput: (value: string) => set({ objectiveInput: value, userAnswer: value }),

      moveToNextQuiz: () => {
        const state = get();
        const nextIndex = state.currentQuizIndex + 1;
        if (nextIndex >= state.quizCount) {
          set({ isShowEnded: true, isTimerRunning: false });
          get().clearAllTimers();
          return;
        }
        set({
          showAnswer: false,
          userAnswer: null,
          selectedOX: null,
          selectedMultipleChoice: null,
          objectiveInput: "",
          currentQuizIndex: nextIndex,
          currentQuiz: state.quizzes[nextIndex],
          isTimerRunning: true,
          isCommentaryShow: false,
          loadingCount: 0,
        });
        get().startQuizTimer();
      },

      checkAnswer: (submitAnswerCallback?: (answer: any) => void) => {
        const state = get();
        if (state.userAnswer === null) return false;
        const currentQuizData = state.quizzes[state.currentQuizIndex];
        let isCorrect = false;
        let answerValue = "";
        if (typeof state.userAnswer === "object" && "value" in state.userAnswer) {
          answerValue = state.userAnswer.value;
          isCorrect = currentQuizData.answer === answerValue;
        } else {
          answerValue = state.userAnswer.toString();
          isCorrect = currentQuizData.answer === answerValue;
        }
        if (submitAnswerCallback) {
          submitAnswerCallback({
            type: "SUBMIT",
            index: state.currentQuizIndex,
            choice: answerValue,
            isCorrect: isCorrect,
          });
        }
        set({
          showAnswer: true,
          isCommentaryShow: true,
          answerTime: state.timeLeft,
          isTimerRunning: true,
        });
        return isCorrect;
      },

      isAnswerCorrect: () => {
        const state = get();
        if (!state.showAnswer || state.userAnswer === null || !state.currentQuiz) return undefined;
        let answerValue = "";
        if (typeof state.userAnswer === "object" && "value" in state.userAnswer) {
          answerValue = state.userAnswer.value;
        } else {
          answerValue = state.userAnswer.toString();
        }
        return state.currentQuiz.answer === answerValue;
      },

      resetStore: () => {
        set(initialState);
        get().clearAllTimers();
      },
    }),
    {
      name: "quiz-show-shared-storage",
      storage: createJSONStorage(() => delayedSessionStorage),
      partialize: (state): Partial<QuizShowSharedStore> => ({
        quizSessionId: state.quizSessionId,
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
        answerTime: state.answerTime,
        isCommentaryShow: state.isCommentaryShow,
      }),
      onRehydrateStorage: () => {
        console.log("[STORAGE] 스토리지로부터 상태 복원이 시도됩니다.");
        return (state, error) => {
          if (error) {
            console.error("[STORAGE] 상태 복원 중 오류 발생:", error);
          } else {
            console.log("[STORAGE] 상태 복원 완료:", state);
            if (state?.isShowStarted && !state.isShowEnded) {
              useQuizShowSharedStore.getState().startInitialCountdown();
            }
          }
        };
      },
    }
  )
);
