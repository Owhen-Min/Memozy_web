interface BaseResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
}

// 개인 퀴즈 결과
export interface QuizResultResponse extends BaseResponse {
  data: QuizResultData;
}
export interface QuizResultData {
  totalQuizCount: number;
  myWrongQuizCount: number;
  round: number;
  point: number;
  incorrectQuizList: string[];
  previousPoint: number;
  collectionName: string;
}

// 단체 퀴즈 전체 결과 (RESULT 타입)
export interface QuizShowResultResponse extends BaseResponse {
  data: {
    type: "RESULT";
    mostWrongQuiz: {
      content: string;
      answer: string;
      commentary: string;
      wrongRate: number;
    };
    topRanking: {
      rank: number;
      name: string;
      score: number;
    }[];
  };
}

// 단체 퀴즈에서의 개인 결과 (MYRESULT 타입)
export interface QuizShowMyResultResponse extends BaseResponse {
  data: {
    type: "MYRESULT";
    myWrongQuizCount: number;
    totalQuizCount: number;
    myScore: number;
  };
}
