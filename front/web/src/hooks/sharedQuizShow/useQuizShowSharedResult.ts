import { useState, useEffect } from "react";

interface QuizShowMyResult {
  myCorrectQuizCount: number;
  myScore: number;
  totalQuizCount: number;
}

interface QuizShowResult {
  mostWrongQuiz: {
    type: "OX" | "MULTIPLE_CHOICE";
    content: string;
    answer: string;
    commentary: string;
    wrongRate: number;
    choice: string[];
    quizId?: string;
  };
  topRanking: {
    rank: number;
    name: string;
    score: number;
  }[];
  collectionName: string;
}

interface UseQuizShowSharedResultProps {
  myResult: QuizShowMyResult | {};
  result: QuizShowResult | {};
  isLoading?: boolean;
}

export const useQuizShowSharedResult = ({
  myResult,
  result,
  isLoading = true,
}: UseQuizShowSharedResultProps) => {
  // 내 결과 데이터 상태
  const [myScore, setMyScore] = useState<number>(0);
  const [totalQuizCount, setTotalQuizCount] = useState<number>(0);
  const [myWrongQuizCount, setMyWrongQuizCount] = useState<number>(0);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(isLoading);

  // 단체 결과 데이터에서 가장 많이 틀린 퀴즈와 랭킹 정보 가져오기
  const [mostWrongQuiz, setMostWrongQuiz] = useState<any>({});
  const [topRanking, setTopRanking] = useState<any[]>([]);

  // 모달 표시 상태
  const [showMostWrongQuizModal, setShowMostWrongQuizModal] = useState(false);

  useEffect(() => {
    setIsResultLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (Object.keys(result).length > 0 && "mostWrongQuiz" in result && "topRanking" in result) {
      const typedResult = result as QuizShowResult;
      setMostWrongQuiz(typedResult.mostWrongQuiz);
      setTopRanking(typedResult.topRanking);
      setIsResultLoading(false);
    }
  }, [result]);

  useEffect(() => {
    if (Object.keys(myResult).length > 0) {
      const typedMyResult = myResult as QuizShowMyResult;
      setMyScore(typedMyResult.myScore || 0);
      setTotalQuizCount(typedMyResult.totalQuizCount || 0);
      // Calculate wrong count from correct count
      const correctCount = typedMyResult.myCorrectQuizCount || 0;
      const totalCount = typedMyResult.totalQuizCount || 0;
      setMyWrongQuizCount(totalCount - correctCount);
    }
  }, [myResult]);

  const handleMostWrongQuizClick = () => {
    setShowMostWrongQuizModal(true);
  };

  const handleCloseMostWrongQuiz = () => {
    setShowMostWrongQuizModal(false);
  };

  // 랭킹 데이터 가공
  const processRankingData = (rankingData: any[]) => {
    if (!rankingData || rankingData.length === 0) return [];

    return rankingData.map((ranker, index) => {
      return {
        rank: ranker.rank,
        name: ranker.name,
        score: `${ranker.score}점`,
        imageIndex: index < 3 ? index : 2, // 0,1,2 이미지 인덱스
      };
    });
  };

  const processedRanking = processRankingData(topRanking);

  return {
    myScore,
    totalQuizCount,
    myWrongQuizCount,
    isResultLoading,
    mostWrongQuiz,
    processedRanking,
    showMostWrongQuizModal,
    handleMostWrongQuizClick,
    handleCloseMostWrongQuiz,
  };
};
