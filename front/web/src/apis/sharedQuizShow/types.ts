import { Quiz } from "../../types/quizShow";

export interface SharedQuizShowResult {
  type: "RESULT";
  mostWrongQuiz: Quiz;
  topRanking: [
    {
      rank: number;
      name: string;
      score: number;
    },
  ];
}
