import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import small_logo from "../../assets/images/small_logo.png";
import Memozy_logo from "../../assets/images/Memozylogo.svg";
import monster1 from "../../assets/images/monster1.png";
import crownIcon from "../../assets/icons/crown.svg";
import outQuizShowIcon from "../../assets/icons/outQuizShowIcon.svg";
import editNicknameIcon from "../../assets/icons/editNickname.svg";
import { QRCodeSVG } from "qrcode.react";

function QuizShowSharedEntry({
  isHost,
  isLoggedIn,
  participants,
  hostNickname,
  nickname,
  collectionName,
  quizCount,
  onStartQuizShow,
  onChangeNickname,
  isLoading,
}: {
  isHost: boolean;
  isLoggedIn: boolean;
  participants: string[];
  nickname: string;
  hostNickname: string;
  collectionName: string;
  quizCount: number;
  onStartQuizShow: () => void;
  onChangeNickname: (newNickname: string) => Promise<boolean | undefined>;
  isLoading: boolean;
}) {
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

    try {
      const success = await onChangeNickname(newNickname);
      if (success) {
        setIsEditingNickname(false);
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류가 발생했습니다.", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-24 font-pre-bold text-main200 mb-4">퀴즈쇼 정보를 불러오는 중...</h2>
          <p className="text-16 font-pre-medium text-gray-500">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center justify-center gap-2">
          <img src={small_logo} alt="logo" className="w-10 h-10" />
          Quiz : <span className="text-normalactive">{collectionName}</span>
        </h1>
        <button
          className="border border-red text-red rounded-lg p-2 flex items-center gap-2"
          onClick={() => navigate(`/collection`)}
        >
          <img src={outQuizShowIcon} alt="outQuizShowIcon" className="w-6 h-6" />
          퀴즈 나가기
        </button>
      </div>
      <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl">
        <div className="flex grid grid-cols-2 items-center">
          <div className="mb-8 w-52 self-start ml-1 md:ml-16 pt-12">
            <img src={Memozy_logo} alt="Memozy 로고" />
          </div>
          <div className="w-full h-full pt-4 flex justify-end items-start relative">
            <div className="relative group pr-5" ref={modalRef}>
              <span
                className="text-16 font-pre-bold pt-4 cursor-pointer"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                현재 참여자 수 : {participants.length}명
              </span>
              <div
                className={`absolute ${showParticipants ? "block" : "hidden"} md:hidden md:group-hover:block right-0 top-full bg-white shadow-lg rounded-lg p-4 z-50 min-w-[150px]`}
              >
                <ul className="max-h-[200px] overflow-y-auto">
                  {participants.map((name, idx) => (
                    <li key={idx} className="py-1">
                      {hostNickname === name ? (
                        <span className="text-16 font-pre-bold flex items-center gap-1">
                          <img src={crownIcon} alt="crown" className="w-6 h-6" />
                          {name}
                        </span>
                      ) : (
                        <span className="text-16 font-pre-regular">{name}</span>
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

          <div className="relative z-10 ml-4 md:ml-32">
            {isHost ? (
              <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                <h2 className="text-20 mb-2 font-pre-medium">단체 퀴즈쇼가 생성되었어요!</h2>
                <p className="text-14 font-pre-regular">
                  원하는 인원이 모두 모였다면 시작하기 버튼을 눌러주세요.
                </p>
              </div>
            ) : (
              <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                <p className="text-16 font-pre-bold">퀴즈 참여가 완료되었어요!</p>
                <p className="text-14 font-pre-regular">
                  호스트가 퀴즈를 시작할 때까지 잠시만 기다려주세요!
                </p>
              </div>
            )}
          </div>

          <div className="absolute right-4 md:right-10 top-[70px] z-30">
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
                          onChange={(e) => setNewNickname(e.target.value)}
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
                컬렉션 : <span className="text-16 font-pre-bold">{collectionName}</span>
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
