import { QuizShowResultResponse } from "../types/quizResult";

export const quizShowResultData: QuizShowResultResponse = {
  success: true,
  errorMsg: null,
  errorCode: null,
  data: {
    type: "RESULT",
    mostWrongQuiz: {
      content: "프랑스의 수도는?",
      answer: "파리",
      commentary: "그렇다.",
      wrongRate: 0.6,
    },
    topRanking: [
      { rank: 1, name: "김진영", score: 95 },
      { rank: 2, name: "Guest201", score: 90 },
      { rank: 3, name: "지녕이", score: 89 },
    ],
  },
};

import { QuizShowMyResultResponse } from "../types/quizResult";

export const quizShowMyResultData: QuizShowMyResultResponse = {
  success: true,
  errorMsg: null,
  errorCode: null,
  data: {
    type: "MYRESULT",
    myWrongQuizCount: 3,
    totalQuizCount: 10,
    myScore: 85,
  },
};
