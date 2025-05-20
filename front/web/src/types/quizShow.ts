export type QuizType = "MULTIPLE_CHOICE" | "OX" | "OBJECTIVE";

export interface Quiz {
  quizId: number;
  answer: string;
  commentary: string;
  content: string;
  choice: string[] | null;
  type: QuizType;
}

export interface QuizShared {
  quizId: number;
  answer: string;
  commentary: string;
  content: string;
  choice: string[] | null;
  startTime: number;
  expiringTime: number;
  answerCloseTime: number;
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
