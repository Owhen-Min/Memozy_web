import { useEffect, useState } from "react";
import { useParams } from "react-router";
import QuizShowSharedEntry from "../features/quizShowSharedPage/QuizShowSharedEntry";
import QuizShowSharedShow from "../features/quizShowSharedPage/QuizShowSharedShow";
import QuizShowSharedResult from "../features/quizShowSharedPage/QuizShowSharedResult";
import { useAuthStore } from "../stores/authStore";
import { useQuizShowSharedStore } from "../stores/quizShowShared/quizShowSharedStore";
import { useQuizShowWebsocket } from "../hooks/sharedQuizShow/useQuizShowWebsocket";

const QuizShowSharedPage = () => {
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
    currentQuizIndex,
    quizSessionId,
    quizzes,
    myResult,
    result,
    isResultReady,
    setCurrentQuizIndex,
    resetStore,
  } = useQuizShowSharedStore();

  const { showId } = useParams();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  // 웹소켓 훅 사용
  const { submitAnswer, handleStartQuizShow, handleChangeNickname, handleShowEnded, isConnected } =
    useQuizShowWebsocket(showId as string);

  // 데이터가 로드되면 로딩 상태 해제
  useEffect(() => {
    // 웹소켓이 연결되고 participants 데이터가 있을 때만 로딩 상태 해제
    if (isConnected && participants?.length > 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [isConnected, participants]);

  // 페이지를 완전히 나갈 때만 스토어 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetStore();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [resetStore]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-main200" />
        </div>
      )}
      <div className="content-quiz">
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
    </>
  );
};

export default QuizShowSharedPage;
