//오답노트 리스트
export interface WrongAnswer {
  id: number;
  name: string;
}

export interface WrongAnswerResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
  data: WrongAnswer[];
}

//오답노트 상세
export interface QuizDetail {
  quizId: number;
  content: string;
  type: string;
  userSelect: string;
  choice: string[] | null;
  answer: string;
  commentary: string;
}

export interface QuizHistory {
  historyId: number;
  회차: string;
  failCount: number;
  date: string;
  quizDatas: QuizDetail[];
}

export interface QuizHistoryData {
  id: number;
  name: string;
  data: QuizHistory[];
}
