import { useState, useEffect } from "react";
import { useParams } from "react-router";
import useWebSocket from "../apis/stompClient";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";
import { useAuthStore } from "../stores/authStore";

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
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
        console.log(payload);
        setHostNickname(payload.hostName);
        setCollectionName(payload.collectionName);
        setNickname(payload.nickname);
        setQuizCount(payload.quizCount);
        if (payload.type === "host") {
          setIsHost(true);
        }
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
          console.log(message);
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

  const handleStartQuizShow = async () => {
    if (!stompClient || !isConnected || !showId) return;

    try {
      await stompClient.publish({
        destination: `/pub/quiz/show/${showId}/start`,
      });

      // 로컬 상태 업데이트
      setIsShowStarted(true);
      return true;
    } catch (error) {
      console.error("닉네임 변경 중 오류가 발생했습니다.", error);
      return false;
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
        />
      )}
      {isShowStarted && !isShowEnded && <QuizShowSharedShow />}
      {isShowEnded && <QuizShowSharedResult />}
    </div>
  );
};

export default QuizShowSharedPage;
