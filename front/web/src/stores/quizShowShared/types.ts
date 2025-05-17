import { Quiz } from "../../types/quizShow";

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
  quizzes: Quiz[];
  myResult: QuizShowMyResult | {};
  result: QuizShowResult | {};
  isResultReady: boolean;

  // 퀴즈쇼 관련 상태 추가
  currentQuiz: Quiz | null;
  showAnswer: boolean;
  userAnswer: string | number | { index: number; value: string } | null;
  selectedOX: "O" | "X" | null;
  selectedMultipleChoice: number | null;
  objectiveInput: string;
  loadingCount: number;
  timeLeft: number;
  isTimerRunning: boolean;
  isCommentaryShow: boolean;
  answerTime: number;
  displayTime: number;

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
  setQuizzes: (quizzes: Quiz[]) => void;
  setMyResult: (myResult: QuizShowMyResult | {}) => void;
  setResult: (result: QuizShowResult | {}) => void;
  setIsResultReady: (isResultReady: boolean) => void;

  // 퀴즈쇼 관련 액션 추가
  setCurrentQuiz: (currentQuiz: Quiz | null) => void;
  setShowAnswer: (showAnswer: boolean) => void;
  setUserAnswer: (userAnswer: string | number | { index: number; value: string } | null) => void;
  setSelectedOX: (selectedOX: "O" | "X" | null) => void;
  setSelectedMultipleChoice: (selectedMultipleChoice: number | null) => void;
  setObjectiveInput: (objectiveInput: string) => void;
  setLoadingCount: (loadingCount: number | ((prev: number) => number)) => void;
  setTimeLeft: (timeLeft: number | ((prev: number) => number)) => void;
  setIsTimerRunning: (isTimerRunning: boolean) => void;
  setIsCommentaryShow: (isCommentaryShow: boolean) => void;
  setAnswerTime: (answerTime: number) => void;
  setDisplayTime: (displayTime: number) => void;

  // 퀴즈 추가 액션
  addQuiz: (quiz: Quiz, index: number) => void;

  // 초기화 액션
  resetStore: () => void;
}
