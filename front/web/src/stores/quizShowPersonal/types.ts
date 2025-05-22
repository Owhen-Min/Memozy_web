import { QuizShowResponse } from "../../types/quizShow";
import { QuizResultResponse } from "../../types/quizResult";

export interface QuizShowPersonalData {
  collectionName: string;
  quizSessionId: string;
  quizList: QuizShowResponse["data"]["quizList"];
  totalQuizCount: number;
}

export interface QuizShowPersonalState {
  // 상태
  quizData: QuizShowPersonalData | null;
  quizResult: QuizResultResponse["data"] | null;
  currentQuizIndex: number;
  isLoading: boolean;
  error: string | null;

  // 액션
  createQuizShow: (collectionId: number, quizCount: number) => Promise<void>;
  submitAnswer: (quizId: number, userAnswer: string, isCorrect: boolean) => Promise<void>;
  getQuizResult: (quizSessionId: string) => Promise<void>;
  resetQuiz: () => void;
}
