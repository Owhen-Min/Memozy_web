import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "../apis/stompClient";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";

interface BaseMessage {
  data: {
    type: string;
  };
}

interface JoinMessage extends BaseMessage {
  data: {
    type: "JOIN" | "HOST";
    userId: string;
    nickname: string;
  };
}

const QuizShowSharedPage = () => {
  const { showId } = useParams();
  const { stompClient, isConnected } = useWebSocket();
  const [isShowStarted, setIsShowStarted] = useState(false);
  const [isShowEnded, setIsShowEnded] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [isHost, setIsHost] = useState(false);

  // 참가 신청 보내기
  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.publish({
        destination: `/pub/quiz/show/${showId}/join`,
        body: JSON.stringify({}),
      });
    }
  }, [showId, stompClient, isConnected]);

  // 새로 참가한 인원 알림 받기
  useEffect(() => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/join`, (message) => {
        const payload = JSON.parse(message.body);
        console.log(`🟢 ${payload.nickname} 님 참가`);
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  // 참가자 목록 받기
  useEffect(() => {
    if (stompClient && isConnected) {
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

  // 퀴즈 시작 알림 받기
  useEffect(() => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe(`/pub/quiz/show/${showId}`, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  // 퀴즈 문제 받기
  useEffect(() => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe(`/sub/quiz/show/${showId}/quiz`, (message) => {
        const data = JSON.parse(message.body);
        console.log(data);
      });
      return () => subscription.unsubscribe();
    }
  }, [showId, stompClient, isConnected]);

  const handleStartQuizShow = () => {
    setIsShowStarted(true);
  };

  return (
    <div className="content-quiz">
      {!isShowStarted && (
        <QuizShowSharedEntry
          isHost={isHost}
          participants={participants}
          nickname={nickname}
          onStartQuizShow={handleStartQuizShow}
        />
      )}
      {isShowStarted && !isShowEnded && <QuizShowSharedShow />}
      {isShowEnded && <QuizShowSharedResult />}
    </div>
  );
};

export default QuizShowSharedPage;
