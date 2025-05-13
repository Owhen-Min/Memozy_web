export type QuizType = "MULTIPLE_CHOICE" | "OX" | "OBJECTIVE";

export interface Quiz {
  quizId: number;
  content: string;
  type: QuizType;
  choice: string[] | null;
  answer: string;
  commentary: string;
}

export interface QuizShowResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
  data: {
    collectionName: string;
    quizSessionId: string;
    quizList: Quiz[];
  };
}
