import { useEffect } from "react";
import useWebSocket from "../../apis/stompClient";
import { useQuizShowSharedStore } from "../../stores/quizShowShared/quizShowSharedStore";
import { QuizShared } from "../../types/quizShow";

interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

export const useQuizShowWebsocket = (showId: string) => {
  // 스토어에서 필요한 상태와 액션 가져오기
  const {
    isLoading,
    userId,
    nickname,
    collectionName,
    setIsLoading,
    setIsShowStarted,
    setIsShowEnded,
    setIsHost,
    setQuizCount,
    setCollectionName,
    setParticipants,
    setNickname,
    setHostId,
    setUserId,
    setQuizSessionId,
    addQuiz,
    setMyResult,
    setResult,
    setIsResultReady,
  } = useQuizShowSharedStore();

  // 웹소켓 연결
  const { stompClient, isConnected } = useWebSocket(showId, userId);

  // 퀴즈 문자열 파싱 함수
  const parseQuizString = (quiz: any): QuizShared => {
    const typeMatch = quiz.type;
    const contentMatch = quiz.content;
    const answerMatch = quiz.answer;
    const commentaryMatch = quiz.commentary;
    const choiceMatch = quiz.choice ? quiz.choice.slice(1, -1).split(",") : [];

    return {
      quizId: quiz.quizId,
      type: typeMatch,
      content: contentMatch ? contentMatch : "",
      answer: answerMatch ? answerMatch : "",
      choice: choiceMatch ? choiceMatch : [],
      commentary: commentaryMatch ? commentaryMatch : "",
    };
  };

  // 웹소켓 연결 상태 감지
  useEffect(() => {
    if (stompClient && isConnected) {
      setIsLoading(false);
    }
  }, [stompClient, isConnected, setIsLoading]);

  // 참가 신청 보내기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const timer = setTimeout(() => {
        stompClient.publish({
          destination: `/pub/quiz/show/${showId}/join`,
          body: JSON.stringify({}),
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showId, stompClient, isConnected]);

  // 참가자 입장 및 세션 정보 구독
  useEffect(() => {
    if (!stompClient || !isConnected || !showId) return;

    const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/join`, (message) => {
      const payload = JSON.parse(message.body);
      console.log(payload);

      if (payload.type === "HOST") {
        if (nickname === "") {
          setHostId(payload.hostId);
          setCollectionName(payload.collectionName);
          setNickname(payload.nickname);
          setQuizCount(payload.quizCount);
          setUserId(payload.userId);
          setIsHost(true);
          setIsLoading(false);
        }
      } else if (payload.type === "JOIN") {
        if (nickname === "") {
          setHostId(payload.hostId);
          setCollectionName(payload.collectionName);
          setNickname(payload.nickname);
          setQuizCount(payload.quizCount);
          setUserId(payload.userId);
          setIsLoading(false);
        }
      } else if (payload.type === "START") {
        setIsShowStarted(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [
    showId,
    stompClient,
    isConnected,
    nickname,
    setHostId,
    setCollectionName,
    setNickname,
    setQuizCount,
    setUserId,
    setIsHost,
    setIsLoading,
    setIsShowStarted,
  ]);

  // 참가자 목록 구독
  useEffect(() => {
    if (!stompClient || !isConnected || !showId) return;

    const subscription = stompClient.subscribe(
      `/sub/quiz/show/${showId}/participants`,
      (message) => {
        const data = JSON.parse(message.body);
        if (data.type === "JOIN" || data.type === "NICKNAME") {
          setParticipants(data.participants);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [showId, stompClient, isConnected, setParticipants]);

  // 퀴즈 문제 구독
  useEffect(() => {
    if (!stompClient || !isConnected || !showId) return;

    const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/quiz`, (message) => {
      const data = JSON.parse(message.body);

      if (data.type === "QUIZ") {
        const quiz = data.quiz;
        const quizObj = parseQuizString(quiz);

        addQuiz(quizObj, data.index);

        if (data.quizSessionId) {
          setQuizSessionId(data.quizSessionId);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [showId, stompClient, isConnected, addQuiz, setQuizSessionId]);

  // 내 퀴즈 결과 구독
  useEffect(() => {
    if (!stompClient || !isConnected || !showId || !userId) return;

    const subscription = stompClient.subscribe(
      `/sub/quiz/show/${showId}/result/${userId}`,
      (message) => {
        const data = JSON.parse(message.body);

        if (data.type === "MYRESULT") {
          const myResultData = {
            myCorrectQuizCount: data.result.myCorrectQuizCount,
            myScore: data.result.myScore,
            totalQuizCount: data.result.totalQuizCount,
          };
          setMyResult(myResultData);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClient, isConnected, userId, showId, setMyResult]);

  // 전체 퀴즈 결과 구독
  useEffect(() => {
    if (!stompClient || !isConnected || !showId) return;

    const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/result`, (message) => {
      const data = JSON.parse(message.body);
      if (data.type === "RESULT") {
        let choiceArray: string[] = [];
        if (
          data.mostWrongQuiz &&
          data.mostWrongQuiz.choice &&
          typeof data.mostWrongQuiz.choice === "string"
        ) {
          try {
            choiceArray = data.mostWrongQuiz.choice
              .replace("[", "")
              .replace("]", "")
              .split(", ")
              .map((item: string) => item.trim());
          } catch (e) {
            console.error("선택지 파싱 오류:", e);
            choiceArray = [];
          }
        }

        const resultData = {
          mostWrongQuiz: data.mostWrongQuiz
            ? {
                ...data.mostWrongQuiz,
                choice: choiceArray,
                commentary: data.mostWrongQuiz.commentary || "",
              }
            : {},
          topRanking: data.topRanking || [],
          collectionName: collectionName,
        };

        setResult(resultData);
        setIsResultReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [stompClient, isConnected, showId, collectionName, setResult, setIsResultReady]);

  // 액션 함수들
  const submitAnswer = (answer: Answer): boolean => {
    if (!stompClient || !isConnected || !showId) return false;

    try {
      stompClient.publish({
        destination: `/pub/quiz/show/${showId}/submit`,
        body: JSON.stringify(answer),
      });
      return true;
    } catch (error) {
      console.error("답변 제출 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  const handleStartQuizShow = async (): Promise<boolean> => {
    if (!stompClient || !isConnected || !showId) return false;

    try {
      await stompClient.publish({
        destination: `/pub/quiz/show/${showId}/start`,
      });
      return true;
    } catch (error) {
      console.error("퀴즈 시작 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  const handleChangeNickname = async (newNickname: string): Promise<boolean> => {
    if (!stompClient || !isConnected || !showId) return false;

    try {
      await stompClient.publish({
        destination: `/pub/quiz/show/${showId}/nickname`,
        body: JSON.stringify({
          type: "NICKNAME",
          nickname: newNickname,
        }),
      });

      setNickname(newNickname);
      return true;
    } catch (error) {
      console.error("닉네임 변경 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  const handleShowEnded = () => {
    setIsShowEnded(true);
  };

  return {
    isConnected,
    isLoading,
    submitAnswer,
    handleStartQuizShow,
    handleChangeNickname,
    handleShowEnded,
  };
};
