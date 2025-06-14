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

interface SubscriptionConfig {
  topic: string;
  handler: (msg: any) => void;
}

export const useQuizShowWebsocket = (showId: string) => {
  // 스토어에서 필요한 상태와 액션 가져오기
  const {
    isLoading,
    userId,
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

  const handleJoin = (message: any) => {
    const payload = JSON.parse(message.body);

    if (payload.type === "HOST") {
      if (useQuizShowSharedStore.getState().userId === "") {
        setHostId(payload.hostId);
        setCollectionName(payload.collectionName);
        setNickname(payload.nickname);
        setQuizCount(payload.quizCount);
        setUserId(payload.userId);
        setIsHost(true);
        setIsLoading(false);
      }
    } else if (payload.type === "JOIN") {
      if (useQuizShowSharedStore.getState().userId === "") {
        setHostId(payload.hostId);
        setUserId(payload.userId);
        setCollectionName(payload.collectionName);
        setNickname(payload.nickname);
        setQuizCount(payload.quizCount);
        setIsLoading(false);
      }
      if (
        useQuizShowSharedStore.getState().hostId &&
        useQuizShowSharedStore.getState().userId &&
        useQuizShowSharedStore.getState().hostId === useQuizShowSharedStore.getState().userId
      ) {
        setIsHost(true);
      }
    } else if (payload.type === "NICKNAME") {
      if (payload.userId === useQuizShowSharedStore.getState().userId) {
        setNickname(payload.nickname);
      }
    } else if (payload.type === "START") {
      setIsShowStarted(true);
    }
  };

  // 웹소켓 연결
  const { stompClient, isConnected } = useWebSocket(showId);

  const handleParticipants = (message: any) => {
    const data = JSON.parse(message.body);
    if (data.type === "JOIN" || data.type === "NICKNAME") {
      setParticipants(data.participants);
    }
  };

  const handleQuiz = (message: any) => {
    const data = JSON.parse(message.body);

    if (data.type === "QUIZ") {
      const quiz = data.quiz;
      const quizObj = parseQuizString(quiz);

      addQuiz(quizObj, data.index);

      if (data.quizSessionId) {
        setQuizSessionId(data.quizSessionId);
      }
    }
  };

  const handleMyResult = (message: any) => {
    const data = JSON.parse(message.body);

    if (data.type === "MYRESULT") {
      const myResultData = {
        myCorrectQuizCount: data.result.myCorrectQuizCount,
        myScore: data.result.myScore,
        totalQuizCount: data.result.totalQuizCount,
      };
      setMyResult(myResultData);
    }
  };

  const handleResult = (message: any) => {
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
            .split("№")
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
  };

  // 퀴즈 문자열 파싱 함수
  const parseQuizString = (quiz: any): QuizShared => {
    const typeMatch = quiz.type;
    const contentMatch = quiz.content;
    const answerMatch = quiz.answer;
    const commentaryMatch = quiz.commentary;
    const choiceMatch = quiz.choice ? quiz.choice.split("№") : [];
    const startTimeMatch = quiz.startTime;

    return {
      quizId: quiz.quizId,
      type: typeMatch,
      content: contentMatch ? contentMatch : "",
      answer: answerMatch ? answerMatch : "",
      choice: choiceMatch ? choiceMatch : [],
      commentary: commentaryMatch ? commentaryMatch : "",
      startTime: startTimeMatch ? startTimeMatch : Date.now() - 500,
      expiringTime: startTimeMatch ? startTimeMatch + 13000 : Date.now() + 12500,
      answerCloseTime: startTimeMatch ? startTimeMatch + 18000 : Date.now() + 17500,
    };
  };

  // 2) useQuizShowWebsocket 안에서
  const subscriptions: SubscriptionConfig[] = [
    { topic: `/sub/quiz/show/${showId}/join`, handler: handleJoin },
    { topic: `/sub/quiz/show/${showId}/participants`, handler: handleParticipants },
    { topic: `/sub/quiz/show/${showId}/quiz`, handler: handleQuiz },
    { topic: `/sub/quiz/show/${showId}/result`, handler: handleResult },
  ];

  // 기본 구독 설정
  useEffect(() => {
    if (!stompClient || !isConnected) return;

    // 기본 구독 등록
    const subs = subscriptions.map(({ topic, handler }) => stompClient.subscribe(topic, handler));

    // 최초 JOIN 발행
    stompClient.publish({
      destination: `/pub/quiz/show/${showId}/join`,
      body: JSON.stringify({}),
    });

    // 언마운트 시 모두 해제
    return () => subs.forEach((sub) => sub.unsubscribe());
  }, [stompClient, isConnected]);

  // userId가 설정된 후 개인 결과 구독 설정
  useEffect(() => {
    if (!stompClient || !isConnected || !userId) return;

    const personalResultSub = stompClient.subscribe(
      `/sub/quiz/show/${showId}/result/${userId}`,
      handleMyResult
    );

    return () => personalResultSub.unsubscribe();
  }, [stompClient, isConnected, userId]);

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
