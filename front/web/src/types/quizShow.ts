export type QuizType = "MULTIPLE_CHOICE" | "OX" | "OBJECTIVE";

export interface Quiz {
  answer: string;
  commentary: string;
  content: string;
  choice: string[] | null;
  type: QuizType;
}

export interface QuizShared {
  answer: string;
  commentary: string;
  content: string;
  choice: string[] | null;
  type: QuizType;
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
