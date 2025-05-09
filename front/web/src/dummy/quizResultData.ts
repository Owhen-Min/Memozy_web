import { QuizResultResponse } from "../types/quizResult";

export const quizResultData: QuizResultResponse = {
  success: true,
  errorMsg: null,
  errorCode: null,
  data: {
    totalQuizCount: 20,
    myWrongQuizCount: 3,
    round: 1,
    point: 85,
  },
};
