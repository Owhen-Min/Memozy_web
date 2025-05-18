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

// NodeJS.Timeout 타입을 위한 인터페이스 선언
declare global {
  interface Timers {
    countdownTimer: any | null;
    quizTimer: any | null;
    commentaryTimer: any | null;
  }
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
  timers: Timers;

  // quizSessionId를 스토어 내부에서 설정하기 위한 액션
  setQuizSessionIdInternal: (id: string) => void;
  // 페이지 컴포넌트에서 호출될 수 있는 액션 (선택 사항, 이미 setQuizSessionIdInternal로 대체 가능성 검토)
  setQuizSessionId: (quizSessionId: string) => void;

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

  // 타이머 관련 액션
  clearAllTimers: () => void;
  startInitialCountdown: () => void;
  startQuizTimer: () => void;

  // 정답 및 퀴즈 관련 액션
  handleOXSelect: (value: "O" | "X") => void;
  handleMultipleChoiceSelect: (answer: { index: number; value: string }) => void;
  handleObjectiveInput: (value: string) => void;
  moveToNextQuiz: () => void;
  checkAnswer: (submitAnswerCallback?: (answer: Answer) => void) => boolean;
  isAnswerCorrect: () => boolean | undefined;

  // 초기화 액션
  resetStore: () => void;
}
