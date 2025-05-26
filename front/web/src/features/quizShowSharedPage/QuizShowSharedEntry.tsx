import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import small_logo from "../../assets/images/small_logo.png";
import Memozy_logo from "../../assets/images/memozylogo.png";
import monster1 from "../../assets/images/monster1.png";
import crownIcon from "../../assets/icons/crown.svg";
import outQuizShowIcon from "../../assets/icons/outQuizShowIcon.svg";
import editNicknameIcon from "../../assets/icons/editNickname.svg";
import { QRCodeSVG } from "qrcode.react";

interface User {
  userId: string;
  nickname: string;
}

interface QuizShowSharedEntryProps {
  isHost: boolean;
  isLoggedIn: boolean;
  participants: User[];
  hostId: string;
  nickname: string;
  collectionName: string;
  quizCount: number;
  isLoading: boolean;
  onStartQuizShow: () => void;
  onChangeNickname: (newNickname: string) => Promise<boolean | undefined>;
  errorHandler: (error: string, options: { showButtons: boolean }) => void;
}

function QuizShowSharedEntry({
  isHost,
  isLoggedIn,
  participants,
  hostId,
  nickname,
  collectionName,
  quizCount,
  isLoading,
  errorHandler,
  onStartQuizShow,
  onChangeNickname,
}: QuizShowSharedEntryProps) {
  const navigate = useNavigate();
  const [showParticipants, setShowParticipants] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const currentUrl = window.location.href;
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowParticipants(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 닉네임이 변경되면 newNickname 상태 업데이트
  useEffect(() => {
    setNewNickname(nickname);
  }, [nickname]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleEditNickname = () => {
    setIsEditingNickname(true);
  };

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNickname.length > 10) {
      errorHandler("닉네임은 10자 이하로 입력해주세요.", { showButtons: false });
      return;
    }

    if (newNickname.trim() === "") {
      setNewNickname(nickname);
      setIsEditingNickname(false);
      return;
    }

    if (newNickname.trim() === nickname) {
      setIsEditingNickname(false);
      return;
    }

    if (participants.some((user) => user.nickname === newNickname)) {
      errorHandler("이미 사용중인 닉네임입니다.", { showButtons: false });
      return;
    }

    try {
      const success = await onChangeNickname(newNickname.replace(" ", ""));
      if (success) {
        setIsEditingNickname(false);
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex text-[28px] font-pre-semibold text-main200 flex items-center gap-1">
          <img src={small_logo} alt="logo" className="h-full" />
          <span
            className="h-full break-all line-clamp-1 relative text-normalactive"
            title={`${collectionName}`}
          >
            {collectionName}
          </span>
        </div>
        <button
          className="flex-shrink-0 border border-red text-red rounded-lg p-2 flex items-center gap-2 text-12 w-100"
          onClick={() => navigate(`/collection`)}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 나가기
        </button>
      </div>
      <div className="w-full min-h-[75vh] sm:min-h-[80vh] bg-white rounded-xl shadow-xl">
        <div className="flex grid grid-cols-2 items-center">
          <div className="mb-8 w-52 self-start ml-2 md:ml-16 pt-6 sm:pt-12">
            <img src={Memozy_logo} alt="Memozy 로고" />
          </div>
          <div className="w-full h-full pt-4 flex justify-end items-start relative">
            <div className="relative group pr-5" ref={modalRef}>
              <span
                className="text-16 font-pre-bold pt-4 cursor-pointer"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                {isLoading
                  ? "퀴즈쇼 정보를 불러오는 중..."
                  : `현재 참여자 수 : ${participants.length}명`}
              </span>
              <div
                className={`absolute ${showParticipants ? "block" : "hidden"} md:hidden md:group-hover:block right-0 top-full bg-white shadow-lg rounded-lg p-4 z-50 min-w-[150px]`}
              >
                <ul className="max-h-[200px] overflow-y-auto">
                  {participants.map((user, idx) => (
                    <li key={idx} className="py-1">
                      {hostId === user.userId ? (
                        <span className="text-16 font-pre-bold flex items-center gap-1 line-clamp-1">
                          <img src={crownIcon} alt="crown" className="w-6 h-6" />
                          {user.nickname}
                        </span>
                      ) : (
                        <span className="text-16 font-pre-regular line-clamp-1">
                          {user.nickname}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative mb-6">
          <div className="absolute right-4 md:right-20 -top-28 z-20">
            <img src={monster1} alt="몬스터1" className="w-16 md:w-32" />
          </div>

          <div className="relative z-10 ml-4 md:ml-32 mt-2 sm:mt-4 sm:mt-0">
            {isLoading ? (
              <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                <h2 className="text-20 mb-2 font-pre-medium">퀴즈쇼 정보를 불러오는 중...</h2>
                <p className="text-14 font-pre-regular">잠시만 기다려주세요</p>
              </div>
            ) : isHost ? (
              <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                <h2 className="text-20 mb-2 font-pre-medium">단체 퀴즈쇼가 생성되었어요!</h2>
                <p className="text-14 font-pre-regular">
                  원하는 인원이 모두 모였다면
                  <br /> 시작하기 버튼을 눌러주세요.
                </p>
              </div>
            ) : (
              <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                <p className="text-16 font-pre-bold">퀴즈 참여가 완료되었어요!</p>
                <p className="text-14 font-pre-regular">
                  호스트가 퀴즈를 시작할 때까지 잠시만 기다려주세요!
                  <br /> 모바일 접속의 경우 화면을 유지해야 정상적으로 작동합니다.
                </p>
              </div>
            )}
          </div>

          <div className="absolute right-4 md:right-10 top-[110px] sm:top-[70px] z-30">
            <div className="flex flex-col items-center w-[30vw] min-w-[200px] max-w-[300px] bg-white shadow-lg rounded-xl p-6 font-pre-medium">
              {isHost ? (
                <div className="flex flex-col items-center mb-4">
                  <div className="border-[1px] border-gray-200 rounded-lg p-2 mb-2">
                    <QRCodeSVG value={currentUrl} size={100} />
                  </div>
                  <button
                    className="text-purple-600 font-pre-medium text-16 cursor-pointer flex items-center"
                    onClick={handleCopyLink}
                  >
                    {copySuccess ? "복사됨!" : "링크복사"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-16 font-pre-medium">
                    {isEditingNickname ? (
                      <form onSubmit={handleNicknameSubmit} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newNickname}
                          maxLength={10}
                          onChange={(e) => setNewNickname(e.target.value.replace(" ", ""))}
                          className="border border-gray-300 rounded-md px-2 py-1 text-14 w-24"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="bg-main200 text-white px-2 py-1 text-12 rounded-md ml-1"
                        >
                          저장
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-20 text-normal font-pre-bold">{nickname}</span>님
                        {!isLoggedIn && (
                          <img
                            src={editNicknameIcon}
                            alt="editNicknameIcon"
                            className="relative h-4 cursor-pointer"
                            onClick={handleEditNickname}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <p className="w-full line-clamp-1 text-center">
                컬렉션 : <span className="text-16 font-pre-bold break-all">{collectionName}</span>
              </p>
              <p>
                퀴즈수 : <span className="text-16 font-pre-bold">{quizCount} 문항</span>
              </p>
              <button
                className={`w-full bg-light text-main200 font-pre-bold mt-4 p-2 rounded-md border-[1px] border-normal hover:bg-lighthover ${
                  isHost
                    ? "bg-light text-main200"
                    : "disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
                }`}
                onClick={onStartQuizShow}
                disabled={!isHost}
              >
                {isHost ? "시작하기" : "잠시만 기다려주세요"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizShowSharedEntry;
