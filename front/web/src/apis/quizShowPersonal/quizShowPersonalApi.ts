import httpClient from "../httpClient";
import { getQuizShowPersonalResultRequest, SubmitQuizShowPersonalAnswerRequest } from "./types";

export const quizShowPersonalApi = {
  //개인 퀴즈쇼 생성
  createQuizShowPersonal: async (collectionId: number, quizCount: number) => {
    const response = await httpClient.get(`/quiz/personal/${collectionId}?count=${quizCount}`);
    return response;
  },
  //개인 퀴즈쇼 결과 조회
  getQuizShowPersonalResult: async (quizSessionId: string) => {
    const requestData: getQuizShowPersonalResultRequest = {
      quizSessionId,
    };
    const response = await httpClient.post(`/quiz/personal/result`, requestData);
    return response;
  },
  //개인 퀴즈쇼 답안 제출
  submitQuizShowPersonalAnswer: async (
    quizId: number,
    quizSessionId: string,
    userAnswer: string,
    isCorrect: boolean
  ) => {
    const requestData: SubmitQuizShowPersonalAnswerRequest = {
      quizSessionId,
      userAnswer,
      isCorrect,
    };
    const response = await httpClient.post(`/quiz/personal/${quizId}`, requestData);
    return response;
  },
};
