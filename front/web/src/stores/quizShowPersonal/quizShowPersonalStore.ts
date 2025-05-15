import { create } from "zustand";
import { quizShowPersonalApi } from "../../apis/quizShowPersonal/quizShowPersonalApi";
import { QuizShowPersonalState, QuizShowPersonalData } from "./types";

const STORAGE_KEY = "quiz_result_data";

export const useQuizShowPersonalStore = create<QuizShowPersonalState>((set, get) => ({
  // 초기 상태
  quizData: null,
  quizResult: JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
  currentQuizIndex: 0,
  isLoading: false,
  error: null,

  // 액션
  createQuizShow: async (collectionId: number, quizCount: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await quizShowPersonalApi.createQuizShowPersonal(collectionId, quizCount);

      if (response.data.success && response.data.data) {
        const quizData: QuizShowPersonalData = {
          collectionName: response.data.data.collectionName,
          quizSessionId: response.data.data.quizSessionId,
          quizList: response.data.data.quizList,
          totalQuizCount: response.data.data.totalQuizCount,
        };
        set({ quizData, isLoading: false });
      } else {
        set({ error: response.data.errorMsg || "퀴즈쇼 생성에 실패했습니다.", isLoading: false });
      }
    } catch (error) {
      set({ error: "퀴즈쇼 생성 중 오류가 발생했습니다.", isLoading: false });
    }
  },

  submitAnswer: async (quizId: number, userAnswer: string, isCorrect: boolean) => {
    try {
      const { quizData } = get();
      if (!quizData) throw new Error("퀴즈 데이터가 없습니다.");

      await quizShowPersonalApi.submitQuizShowPersonalAnswer(
        quizId,
        quizData.quizSessionId,
        userAnswer,
        isCorrect
      );

      set((state) => ({
        currentQuizIndex: state.currentQuizIndex + 1,
      }));
    } catch (error) {
      set({ error: "답안 제출에 실패했습니다." });
    }
  },

  getQuizResult: async (quizSessionId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await quizShowPersonalApi.getQuizShowPersonalResult(quizSessionId);

      if (response.data.success && response.data.data) {
        const resultData = response.data.data;
        set({ quizResult: resultData, isLoading: false });
        // 로컬 스토리지에 저장
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resultData));
      } else {
        set({ error: response.data.errorMsg || "결과 조회에 실패했습니다.", isLoading: false });
      }
    } catch (error) {
      set({ error: "결과 조회 중 오류가 발생했습니다.", isLoading: false });
    }
  },

  resetQuiz: () => {
    set({
      quizData: null,
      quizResult: null,
      currentQuizIndex: 0,
      error: null,
    });
    // 로컬 스토리지도 초기화
    localStorage.removeItem(STORAGE_KEY);
  },
}));
