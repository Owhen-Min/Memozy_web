import { useState } from "react";
import { useNavigate } from "react-router";
import closeIcon from "../../assets/icons/closeIcon.svg";

interface CreateQuizShowModalProps {
  onClose: () => void;
  collectionId: string | undefined;
  collectionName: string;
  quizCount: number;
}

function CreateQuizShowModal({
  onClose,
  collectionId,
  collectionName,
  quizCount: totalQuizCount,
}: CreateQuizShowModalProps) {
  const navigate = useNavigate();
  const [isShared, setIsShared] = useState(false);
  const [quizCount, setQuizCount] = useState(1);

  const handleQuizShowCreate = () => {
    // TODO: 퀴즈 시작 로직 구현
    console.log(
      "퀴즈쇼 생성 컬렉션 이름 : ",
      collectionName,
      "퀴즈쇼 생성 컬렉션 id : ",
      collectionId,
      "퀴즈 수 : ",
      quizCount,
      "공유 여부 : ",
      isShared
    );
    onClose();
    navigate(
      isShared ? `/quiz-entry/shared/${collectionId}` : `/quiz-entry/personal/${collectionId}`
    );
  };

  // 선택 가능한 퀴즈 수 배열 생성 (1부터 totalQuizCount까지)
  const availableQuizCounts = Array.from({ length: totalQuizCount }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>

        <h1 className="text-[24px] font-pre-bold text-center mb-4">퀴즈쇼 생성하기</h1>

        <p className="text-[14px] font-pre-regular text-gray200 text-center mb-8">
          해당 컬렉션에서 설정한 퀴즈 수만큼 랜덤한 퀴즈를 선정합니다
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-pre-medium text-main200">친구들과 함께 풀기</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-normal"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[16px] font-pre-medium">퀴즈 수</span>
            <select
              value={quizCount}
              onChange={(e) => setQuizCount(Number(e.target.value))}
              className="
                                border border-gray-300 rounded-lg px-4 py-2 w-24 text-center
                                text-[16px] font-pre-medium
                                focus:outline-none focus:ring-2 focus:ring-main200
                                appearance-none
                                bg-white
                                bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')]
                                bg-no-repeat bg-[right_1rem_center]
                            "
            >
              {availableQuizCounts.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleQuizShowCreate}
          className="w-full bg-normal text-white rounded-xl py-2 mt-8 font-pre-medium hover:bg-normal/90 transition-colors"
        >
          퀴즈쇼 생성
        </button>
      </div>
    </div>
  );
}

export default CreateQuizShowModal;
