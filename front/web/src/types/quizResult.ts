export interface QuizResultResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
  data: QuizResultData;
}

export interface QuizResultData {
  totalQuizCount: number;
  myWrongQuizCount: number;
  round: number;
  point: number;
}
