import { useEffect, useState } from "react";
import { useParams } from "react-router";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";
import { useAuthStore } from "../stores/authStore";
import { useErrorStore } from "../stores/errorStore";
import { useQuizShowSharedStore } from "../stores/quizShowShared/quizShowSharedStore";
import { useQuizShowWebsocket } from "../hooks/sharedQuizShow/useQuizShowWebsocket";
import httpClient from "../apis/httpClient";

const QuizShowSharedPage = () => {
  const { showId } = useParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const setError = useErrorStore((state) => state.setError);

  // 웹소켓 훅 사용
  const { submitAnswer, handleStartQuizShow, handleChangeNickname, handleShowEnded, isConnected } =
    useQuizShowWebsocket(showId as string);

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    isShowStarted,
    isShowEnded,
    isHost,
    quizCount,
    collectionName,
    participants,
    nickname,
    hostId,
    quizSessionId,
    quizzes,
    myResult,
    result,
    isResultReady,
    resetStore,
    setQuizSessionId,
  } = useQuizShowSharedStore();
  // 세션 ID 설정 및 상태 복원
  useEffect(() => {
    if (showId) {
      setQuizSessionId(showId);
      sessionStorage.setItem("current-session-id", showId);
    }
  }, [showId, setQuizSessionId]);

  // 데이터가 로드되면 로딩 상태 해제
  useEffect(() => {
    if (isConnected && participants?.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [isConnected, participants]);

  // 페이지를 완전히 나갈 때만 스토어 초기화
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(`quiz-show-shared-storage-${showId}`);
      sessionStorage.removeItem("current-session-id");
      resetStore();
    };
  }, [resetStore]);

  const handleSaveQuizClick = async () => {
    await httpClient
      .post(`quiz/show/${showId}`)
      .then((res) => {
        if (res.data.success) {
          if (!isHost) {
            window.alert("나의 컬렉션에 저장되었습니다.");
          }
        } else {
          setError(res.data.errorMsg, { showButtons: false });
        }
      })
      .catch((err) => {
        setError(err, { showButtons: false });
      });
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-main200" />
        </div>
      )}
      <div className="content-quiz-shared">
        {!isShowStarted && (
          <QuizShowSharedEntry
            isHost={isHost}
            isLoading={isLoading}
            isLoggedIn={isLoggedIn}
            collectionName={collectionName}
            participants={participants}
            nickname={nickname}
            hostId={hostId}
            quizCount={quizCount}
            onStartQuizShow={handleStartQuizShow}
            onChangeNickname={handleChangeNickname}
          />
        )}
        {isShowStarted && !isShowEnded && (
          <QuizShowSharedShow
            quizCount={quizCount}
            quizList={quizzes}
            quizSessionId={quizSessionId}
            collectionName={collectionName}
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
            handleSaveQuizClick={handleSaveQuizClick}
          />
        )}
      </div>
    </>
  );
};

export default QuizShowSharedPage;
