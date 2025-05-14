import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "../apis/stompClient";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";
import { useAuthStore } from "../stores/authStore";
import { Quiz } from "../types/quizShow";

// 알림 인터페이스 정의
interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

const QuizShowSharedPage = () => {
  const { showId } = useParams();
  const { stompClient, isConnected } = useWebSocket();
  const [isShowStarted, setIsShowStarted] = useState(false);
  const [isShowEnded, setIsShowEnded] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [collectionName, setCollectionName] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [hostNickname, setHostNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 알림 상태 관리
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextNotificationId, setNextNotificationId] = useState(1);

  // 추가된 상태
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizSessionId, setQuizSessionId] = useState<string>("");

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

  // 새로 참가한 인원 알림 받기
  useEffect(() => {
    if (stompClient && isConnected && showId) {
      const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/join`, (message) => {
        const payload = JSON.parse(message.body);
        console.log(payload);

        if (payload.type === "host") {
          setHostNickname(payload.hostName);
          setCollectionName(payload.collectionName);
          setNickname(payload.nickname);
          setQuizCount(payload.quizCount);
          setIsHost(true);
          setIsLoading(false);
        } else if (payload.type === "join") {
          if (nickname === "") {
            setHostNickname(payload.hostName);
            setCollectionName(payload.collectionName);
            setNickname(payload.nickname);
            setQuizCount(payload.quizCount);
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
          if (data.type === "PARTICIPANT_LIST") {
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
        setIsShowStarted(true);

        if (data.type === "quiz") {
          // 문자열로 된 퀴즈 데이터를 파싱
          const quizStr = data.quiz;
          const quizObj = parseQuizString(quizStr);

          // 퀴즈 배열에 추가
          setQuizzes((prev) => {
            // 인덱스 위치에 퀴즈 추가
            const newQuizzes = [...prev];
            newQuizzes[data.index] = quizObj;
            return newQuizzes;
          });

          // 세션 ID 설정 (필요하다면)
          if (data.quizSessionId) {
            setQuizSessionId(data.quizSessionId);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  // 퀴즈 문자열 파싱 함수
  const parseQuizString = (quizString: string): Quiz => {
    // 문자열에서 필요한 정보 추출
    const quizIdMatch = quizString.match(/quizId=(\d+)/);
    const typeMatch = quizString.match(/type=(\w+)/);
    const contentMatch = quizString.match(/content=([^,}]+)/);
    const answerMatch = quizString.match(/answer=([^,}]+)/);

    // choice 배열 추출 (대괄호 안의 내용)
    const choiceMatch = quizString.match(/choice=\[(.*?)\]/);
    const choices = choiceMatch ? [choiceMatch[1]] : [];

    return {
      quizId: quizIdMatch ? parseInt(quizIdMatch[1]) : 0,
      type: typeMatch
        ? (typeMatch[1] as "MULTIPLE_CHOICE" | "OX" | "OBJECTIVE")
        : "MULTIPLE_CHOICE",
      content: contentMatch ? contentMatch[1] : "",
      answer: answerMatch ? answerMatch[1] : "",
      choice: choices,
      commentary: "",
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
          hostNickname={hostNickname}
          quizCount={quizCount}
          onStartQuizShow={handleStartQuizShow}
          onChangeNickname={handleChangeNickname}
          isLoading={isLoading}
        />
      )}
      {isShowStarted && !isShowEnded && (
        <QuizShowSharedShow
          quizList={quizzes}
          quizSessionId={quizSessionId}
          collectionName={collectionName}
          currentQuizIndex={currentQuizIndex}
        />
      )}
      {isShowEnded && <QuizShowSharedResult />}
    </div>
  );
};

export default QuizShowSharedPage;
