import { QuizShared } from "../../types/quizShow";

export interface User {
  userId: string;
  nickname: string;
}

export interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

export interface QuizShowMyResult {
  myCorrectQuizCount: number;
  myScore: number;
  totalQuizCount: number;
}

export interface QuizShowResult {
  mostWrongQuiz: {
    type: "OX" | "MULTIPLE";
    content: string;
    answer: string;
  };
  topRanking: {
    rank: number;
    name: string;
    score: number;
  }[];
}

export interface QuizShowSharedStore {
  // 기본 상태
  isLoading: boolean;
  isShowStarted: boolean;
  isShowEnded: boolean;
  isHost: boolean;
  quizCount: number;
  collectionName: string;
  participants: User[];
  nickname: string;
  hostId: string;
  userId: string;
  currentQuizIndex: number;
  quizSessionId: string;

  // 퀴즈 관련 상태
  quizzes: QuizShared[];
  myResult: QuizShowMyResult | {};
  result: QuizShowResult | {};
  isResultReady: boolean;

  // 액션
  setIsLoading: (isLoading: boolean) => void;
  setIsShowStarted: (isShowStarted: boolean) => void;
  setIsShowEnded: (isShowEnded: boolean) => void;
  setIsHost: (isHost: boolean) => void;
  setQuizCount: (quizCount: number) => void;
  setCollectionName: (collectionName: string) => void;
  setParticipants: (participants: User[]) => void;
  setNickname: (nickname: string) => void;
  setHostId: (hostId: string) => void;
  setUserId: (userId: string) => void;
  setCurrentQuizIndex: (currentQuizIndex: number) => void;
  setQuizSessionId: (quizSessionId: string) => void;
  setQuizzes: (quizzes: QuizShared[]) => void;
  setMyResult: (myResult: QuizShowMyResult | {}) => void;
  setResult: (result: QuizShowResult | {}) => void;
  setIsResultReady: (isResultReady: boolean) => void;

  // 퀴즈 추가 액션
  addQuiz: (quiz: QuizShared, index: number) => void;

  // 초기화 액션
  resetStore: () => void;
}
