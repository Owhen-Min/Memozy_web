export interface getQuizShowPersonalResultRequest {
  quizSessionId: string;
}

export interface SubmitQuizShowPersonalAnswerRequest {
  quizSessionId: string;
  userAnswer: string;
  isCorrect: boolean;
}
