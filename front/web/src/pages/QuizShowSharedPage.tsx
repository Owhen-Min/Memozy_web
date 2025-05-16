import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "../apis/stompClient";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";
import { useAuthStore } from "../stores/authStore";
import { useQuizShowSharedStore } from "../stores/quizShowShared/quizShowSharedStore";
import { QuizShared } from "../types/quizShow";

// 알림 인터페이스 정의
interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface Answer {
  type: "SUBMIT";
  index: number;
  choice: string;
  isCorrect: boolean;
}

const QuizShowSharedPage = () => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    isLoading,
    isShowStarted,
    isShowEnded,
    isHost,
    quizCount,
    collectionName,
    participants,
    nickname,
    hostId,
    userId,
    currentQuizIndex,
    quizSessionId,
    quizzes,
    myResult,
    result,
    isResultReady,
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
    setCurrentQuizIndex,
    setQuizSessionId,
    addQuiz,
    setMyResult,
    setResult,
    setIsResultReady,
    resetStore,
  } = useQuizShowSharedStore();

  const { showId } = useParams();
  const { stompClient, isConnected } = useWebSocket(showId as string, userId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 알림 상태 관리
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextNotificationId, setNextNotificationId] = useState(1);

  // 알림 추가 함수
  const addNotification = (
    message: string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    const newNotification = {
      id: nextNotificationId,
      message,
      type,
    };

    setNotifications((prev) => [...prev, newNotification]);
    setNextNotificationId((prev) => prev + 1);

    // 3초 후 자동으로 알림 제거
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== newNotification.id)
      );
    }, 3000);
  };

  // 핸들 Show Ended 함수
  const handleShowEnded = () => {
    setIsShowEnded(true);
  };

  // 웹소켓 연결 상태 감지
  useEffect(() => {
    if (stompClient && isConnected) {
      setIsLoading(false);
    }
  }, [stompClient, isConnected]);

  // 참가 신청 보내기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      // 약간의 딜레이를 주어 stompClient가 완전히 준비된 후 요청
      const timer = setTimeout(() => {
        stompClient.publish({
          destination: `/pub/quiz/show/${showId}/join`,
          body: JSON.stringify({}),
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showId, stompClient, isConnected]);

  // 푼 문제 제출하기
  const submitAnswer = (answer: Answer) => {
    if (!stompClient || !isConnected || !showId) return;

    try {
      stompClient.publish({
        destination: `/pub/quiz/show/${showId}/submit`,
        body: JSON.stringify(answer),
      });
    } catch (error) {
      console.error("답변 제출 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  // 새로 참가한 인원 알림 받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
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
          } else {
            // 새로운 참가자가 입장했을 때 알림 표시
            addNotification(`${payload.nickname} 님이 입장하셨습니다.`, "success");
          }
        } else if (payload.type === "START") {
          setIsShowStarted(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected, nickname]);

  // 참가자 목록 받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const subscription = stompClient.subscribe(
        `/sub/quiz/show/${showId}/participants`,
        (message) => {
          const data = JSON.parse(message.body);
          console.log(data);
          if (data.type === "JOIN" || data.type === "NICKNAME") {
            setParticipants(data.participants);
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  // 퀴즈 문제 받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/quiz`, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);

        if (data.type === "QUIZ") {
          // 문자열로 된 퀴즈 데이터를 파싱
          const quiz = data.quiz;
          const quizObj = parseQuizString(quiz);

          // 퀴즈 추가
          addQuiz(quizObj, data.index);

          // 세션 ID 설정 (필요하다면)
          if (data.quizSessionId) {
            setQuizSessionId(data.quizSessionId);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  // 내 퀴즈 결과 응답받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const subscription = stompClient.subscribe(
        `/sub/quiz/show/${showId}/result/${userId}`,
        (message) => {
          const data = JSON.parse(message.body);
          console.log(data);
          if (data.type === "MYRESULT") {
            // 중첩된 구조 처리
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
    }
  }, [stompClient, isConnected, userId, showId]);

  // 전체 퀴즈 결과 응답받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/result`, (message) => {
        const data = JSON.parse(message.body);
        if (data.type === "RESULT") {
          console.log(data);

          // 문자열로 된 choice 배열을 실제 배열로 변환
          let choiceArray: string[] = [];
          if (
            data.mostWrongQuiz &&
            data.mostWrongQuiz.choice &&
            typeof data.mostWrongQuiz.choice === "string"
          ) {
            try {
              // 문자열에서 대괄호 제거 후 쉼표로 분할
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
    }
  }, [stompClient, isConnected, userId, showId, collectionName]);

  // 퀴즈 문자열 파싱 함수
  const parseQuizString = (quiz: any): QuizShared => {
    // 문자열에서 필요한 정보 추출
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

  const handleStartQuizShow = async () => {
    if (!stompClient || !isConnected || !showId) return;

    try {
      await stompClient.publish({
        destination: `/pub/quiz/show/${showId}/start`,
      });
      return;
    } catch (error) {
      console.error("퀴즈 시작 중 오류가 발생했습니다.", error);
      return;
    }
  };

  // 닉네임 변경 함수
  const handleChangeNickname = async (newNickname: string) => {
    if (!stompClient || !isConnected || !showId) return;

    try {
      await stompClient.publish({
        destination: `/pub/quiz/show/${showId}/nickname`,
        body: JSON.stringify({
          type: "NICKNAME",
          nickname: newNickname,
        }),
      });

      // 로컬 상태 업데이트
      setNickname(newNickname);
      return true;
    } catch (error) {
      console.error("닉네임 변경 중 오류가 발생했습니다.", error);
      return false;
    }
  };

  // 컴포넌트 언마운트 시 스토어 초기화
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  return (
    <div className="content-quiz">
      {/* 알림 메시지 표시 영역 */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-md text-white animate-fadeIn ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                  ? "bg-red-500"
                  : notification.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {!isShowStarted && (
        <QuizShowSharedEntry
          isHost={isHost}
          isLoggedIn={isLoggedIn}
          collectionName={collectionName}
          participants={participants}
          nickname={nickname}
          hostId={hostId}
          quizCount={quizCount}
          onStartQuizShow={handleStartQuizShow}
          onChangeNickname={handleChangeNickname}
          isLoading={isLoading}
        />
      )}
      {isShowStarted && !isShowEnded && (
        <QuizShowSharedShow
          quizCount={quizCount}
          quizList={quizzes}
          quizSessionId={quizSessionId}
          collectionName={collectionName}
          currentQuizIndex={currentQuizIndex}
          setCurrentQuizIndex={setCurrentQuizIndex}
          handleShowEnded={handleShowEnded}
          submitAnswer={submitAnswer}
        />
      )}
      {isShowEnded && (
        <QuizShowSharedResult
          isHost={isHost}
          isLoggedIn={isLoggedIn}
          myResult={myResult}
          result={result}
          collectionName={collectionName}
          isLoading={!isResultReady}
        />
      )}
    </div>
  );
};

export default QuizShowSharedPage;
