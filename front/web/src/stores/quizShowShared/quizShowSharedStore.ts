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
      console.warn(`[DEBUG] getItem: 세션 ID 사용 불가, ${name} 로드 실패.`);
      return null;
    }
    const suffixedName = `${name}-${sessionId}`;
    const value = sessionStorage.getItem(suffixedName);
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const sessionId = await getSessionIdWhenReady();
    if (!sessionId) {
      console.warn(`[DEBUG] setItem: 세션 ID 사용 불가, ${name} 저장 실패.`);
      return;
    }
    const suffixedName = `${name}-${sessionId}`;
    sessionStorage.setItem(suffixedName, value);
  },
  removeItem: async (name: string): Promise<void> => {
    const sessionId = await getSessionIdWhenReady();
    if (!sessionId) {
      console.warn(`[DEBUG] removeItem: 세션 ID 사용 불가, ${name} 삭제 실패.`);
      return;
    }
    const suffixedName = `${name}-${sessionId}`;
    sessionStorage.removeItem(suffixedName);
  },
};

// 전역 타이머 ID를 관리하여 상태 업데이트와 타이머가 분리되도록 함
let globalQuizTimer: any = null;
let isTimerActive = false;

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

        // 전역 타이머도 정리
        if (globalQuizTimer) {
          clearInterval(globalQuizTimer);
          globalQuizTimer = null;
          isTimerActive = false;
        }

        set({ timers: { countdownTimer: null, quizTimer: null, commentaryTimer: null } });
      },

      initQuizData: (quizList: Quiz[], quizCountValue: number, collectionNameValue: string) => {
        if (get().isInitialized) {
          set({
            quizzes: quizList,
            quizCount: quizCountValue,
            collectionName: collectionNameValue,
          });
          return;
        }

        set({
          quizzes: quizList,
          quizCount: quizCountValue,
          collectionName: collectionNameValue,
          isInitialized: true,
          isShowStarted: true,
        });
      },

      startCountdown: () => {
        const { clearAllTimers, quizzes, currentQuizIndex: cqIndex, isTimerRunning } = get();

        if (isTimerRunning) {
          return;
        }

        clearAllTimers();
        if (quizzes.length > 0) {
          const isResuming =
            get().isShowStarted &&
            !get().isShowEnded &&
            (get().currentQuizIndex > 0 || !get().isFirstStart);

          if (isResuming) {
            set({
              currentQuiz: quizzes[cqIndex],
              isTimerRunning: true,
              loadingCount: 0,
              isFirstStart: false,
            });
            get().startQuizTimer();
            return;
          }

          set({ loadingCount: 3 });
          const countdownInterval = setInterval(() => {
            set((state) => {
              const newLoadingCount = state.loadingCount <= 1 ? 0 : state.loadingCount - 1;
              if (newLoadingCount <= 0) {
                if (state.timers.countdownTimer) clearInterval(state.timers.countdownTimer);
                setTimeout(() => {
                  set({
                    currentQuiz: state.quizzes[0],
                    isTimerRunning: true,
                    isFirstStart: false,
                  });
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

      startInitialCountdown: () => {
        get().startCountdown();
      },

      startQuizTimer: () => {
        const currentState = get();

        // 이미 글로벌 타이머가 실행 중인 경우 중복 실행 방지
        if (isTimerActive) {
          return;
        }
        // get().clearAllTimers();

        // 전역 타이머 변수만 초기화
        if (globalQuizTimer) {
          clearInterval(globalQuizTimer);
          globalQuizTimer = null;
        }

        // 타이머 초기 상태 설정 - 현재 상태 유지
        set({
          timeLeft: currentState.timeLeft,
          displayTime: currentState.displayTime,
          isTimerRunning: true,
          showAnswer: currentState.showAnswer,
        });

        // 타이머 활성화 상태 설정
        isTimerActive = true;

        // 전역 타이머 시작
        globalQuizTimer = setInterval(() => {
          // 현재 상태를 안전하게 가져옴
          const currentState = get();

          // 이미 정답 화면인 경우 타이머는 계속 진행
          if (currentState.showAnswer) {
            // 정답 화면에서는 timeLeft와 displayTime 모두 감소
            const newTimeLeft = currentState.timeLeft <= 1 ? 0 : currentState.timeLeft - 1;
            const newDisplayTime = newTimeLeft;

            set(() => ({
              timeLeft: newTimeLeft,
              displayTime: newDisplayTime,
              isTimerRunning: true,
            }));

            // displayTime이 0 이하면 다음 문제로 이동
            if (newDisplayTime <= 0) {
              setTimeout(() => get().moveToNextQuiz(), 50);
            }

            return;
          }

          // 상태 업데이트 - 타이머 감소
          set((state) => {
            // 이미 정답 화면인 경우 불필요한 상태 업데이트 방지
            if (state.showAnswer) {
              return state; // 상태 변경 없음
            }

            // timeLeft 계산 (타이머 감소)
            const timeLeft = state.timeLeft <= 1 ? 0 : state.timeLeft - 1;
            // 화면에 표시할 시간 계산 (남은 시간에서 10초를 뺀 값, 최소 0)
            const displayTime = Math.max(0, timeLeft - 10);

            // 타이머가 0이 되면 종료 처리
            if (timeLeft <= 0) {
              // 타이머가 0에 도달했을 때만 타이머 정리
              if (globalQuizTimer) {
                clearInterval(globalQuizTimer);
                globalQuizTimer = null;
                isTimerActive = false;
              }

              if (!state.showAnswer) {
                // 타이머 상태 먼저 업데이트
                setTimeout(() => {
                  const current = get();
                  // 아직도 상태가 변경되지 않았을 때만 다음 문제로 이동
                  if (!current.showAnswer && current.timeLeft <= 0) {
                    get().moveToNextQuiz();
                  }
                }, 3000);
              }

              // 타이머가 종료되어도 showAnswer 상태는 변경하지 않음
              return {
                timeLeft: 0,
                displayTime: 0,
                timers: { ...state.timers, quizTimer: null },
                isTimerRunning: false,
              };
            }

            // 타이머가 10초가 되었을 때 해설 화면으로 전환하고 자동 제출
            if (state.timeLeft === 10) {
              // 비동기적으로 자동 제출 로직 실행
              setTimeout(() => {
                const current = get();
                // 아직 정답을 제출하지 않았고 타이머가 아직 10초 이하인 경우에만 자동 제출
                if (!current.showAnswer && current.timeLeft <= 10) {
                  current.autoSubmitAnswer();
                }
              }, 0);

              // 해설 화면 전환 - 여기서는 showAnswer는 변경하지 않음
              // 자동 제출 로직에서 showAnswer를 변경할 것임
              return {
                timeLeft: timeLeft,
                displayTime: timeLeft, // 해설 화면에서는 displayTime = timeLeft
                answerTime: state.timeLeft - 10,
                isTimerRunning: true,
              };
            }

            return {
              timeLeft,
              displayTime,
              isTimerRunning: true,
            };
          });
        }, 1000);

        // 타이머 ID 저장 - 전역 변수와 상태 모두에 저장
        set((state) => ({
          timers: {
            ...state.timers,
            quizTimer: globalQuizTimer,
          },
          isTimerRunning: true,
        }));
      },

      handleOXSelect: (value: "O" | "X") => set({ selectedOX: value, userAnswer: value }),
      handleMultipleChoiceSelect: (answer: { index: number; value: string }) =>
        set({ selectedMultipleChoice: answer.index - 1, userAnswer: answer }),
      handleObjectiveInput: (value: string) => set({ objectiveInput: value, userAnswer: value }),

      moveToNextQuiz: () => {
        const state = get();
        const nextIndex = state.currentQuizIndex + 1;

        // 전역 타이머 정리 - 반드시 새 타이머를 시작하기 전에 정리
        if (globalQuizTimer) {
          clearInterval(globalQuizTimer);
          globalQuizTimer = null;
          isTimerActive = false;
        }

        if (nextIndex >= state.quizCount) {
          set({ isShowEnded: true, isTimerRunning: false });
          get().clearAllTimers();
          return;
        }

        // 다음 문제로 이동 시 상태 초기화
        set({
          showAnswer: false, // 정답 화면 초기화
          userAnswer: null,
          selectedOX: null,
          selectedMultipleChoice: null,
          objectiveInput: "",
          currentQuizIndex: nextIndex,
          currentQuiz: state.quizzes[nextIndex],
          isTimerRunning: true,
          loadingCount: 0,
          timeLeft: 30,
          displayTime: 20,
        });

        // 약간의 지연 후 타이머 시작 (이전 타이머 정리 시간 확보)
        setTimeout(() => {
          get().startQuizTimer();
        }, 10);
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

        // 정답 확인 시 상태 설정
        set({
          showAnswer: true, // 정답 화면 표시
          answerTime: state.timeLeft, // 정답 확인 시간 기록
          displayTime: state.timeLeft, // 해설 화면에서는 displayTime = timeLeft
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
        set({
          ...initialState,
          isInitialized: false,
          isFirstStart: true,
        });
        get().clearAllTimers();
      },

      autoSubmitAnswer: () => {
        const state = get();
        const currentQuizData = state.quizzes[state.currentQuizIndex];

        if (state.showAnswer) {
          return;
        }

        let answerValue = "";
        let isCorrect = false;

        if (state.userAnswer !== null) {
          if (typeof state.userAnswer === "object" && "value" in state.userAnswer) {
            answerValue = state.userAnswer.value;
          } else {
            answerValue = state.userAnswer.toString();
          }
        } else {
          if (currentQuizData.type === "OX") {
            answerValue = state.selectedOX || "O";
          } else if (currentQuizData.type === "MULTIPLE_CHOICE") {
            answerValue = currentQuizData.choice?.[0] || "";
          } else if (currentQuizData.type === "OBJECTIVE") {
            answerValue = state.objectiveInput || "";
          } else {
            answerValue = "";
          }
        }

        isCorrect = currentQuizData.answer === answerValue;

        // 정답 자동 제출 시 상태 설정
        set({
          showAnswer: true, // 정답 화면 표시
          answerTime: state.timeLeft, // 정답 확인 시간 기록
          userAnswer: answerValue, // 사용자 답변 설정
          displayTime: state.timeLeft, // 해설 화면에서는 displayTime = timeLeft
          isTimerRunning: true,
        });

        return isCorrect;
      },
    }),
    {
      name: "quiz-show-shared-storage",
      storage: createJSONStorage(() => delayedSessionStorage),
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
                useQuizShowSharedStore.getState().startCountdown();
              }, 100);
            }
          }
        };
      },
    }
  )
);
