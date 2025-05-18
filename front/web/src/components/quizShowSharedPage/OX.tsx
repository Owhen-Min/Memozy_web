import { useState } from "react";
import OIcon from "../../assets/icons/OIcon.svg";
import XIcon from "../../assets/icons/XIcon.svg";

interface OXProps {
  content: string;
  answer: string;
  showAnswer: boolean;
  onAnswerSelect: (answer: "O" | "X") => void;
  isCorrect?: boolean; // 사용자가 제출한 답이 정답인지 여부
  selected?: "O" | "X" | null; // 부모 컴포넌트에서 관리하는 선택 상태
}

const OX = ({
  content,
  answer,
  showAnswer,
  onAnswerSelect,
  selected: externalSelected,
}: OXProps) => {
  // 내부 상태는 외부에서 전달받은 선택 상태로 초기화
  const [internalSelected, setInternalSelected] = useState<null | "O" | "X">(
    externalSelected || null
  );

  // 실제 사용할 선택 상태 (외부 상태 우선)
  const selected = externalSelected !== undefined ? externalSelected : internalSelected;

  const handleSelect = (value: "O" | "X") => {
    if (showAnswer) return; // showAnswer가 true일 때 선택 변경 불가

    // 내부 상태도 업데이트 (폴백용)
    setInternalSelected(value);
    onAnswerSelect(value);
  };

  // 버튼 스타일 생성 함수
  const getButtonStyle = (value: "O" | "X") => {
    const baseStyle = "transition-transform duration-200 rounded-xl p-4";

    if (!showAnswer) {
      return `${baseStyle} ${selected === value ? "bg-light" : ""} hover:scale-110`;
    }

    // 정답 표시
    if (value === answer) {
      return `${baseStyle} bg-green-100 border-2 border-green-500`;
    }
    // 사용자가 선택한 오답 표시 (isCorrect 확인 조건 제거)
    else if (selected === value) {
      return `${baseStyle} bg-red-100 border-2 border-red-500`;
    }

    return baseStyle;
  };

  return (
    <div>
      <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium flex items-center justify-center">
        {content}
      </div>
      <div className="w-full flex justify-center gap-32">
        <button
          className={getButtonStyle("O")}
          onClick={() => handleSelect("O")}
          disabled={showAnswer}
        >
          <img className="w-[150px] h-[150px]" src={OIcon} alt="OIcon" />
        </button>
        <button
          className={getButtonStyle("X")}
          onClick={() => handleSelect("X")}
          disabled={showAnswer}
        >
          <img className="w-[150px] h-[150px]" src={XIcon} alt="XIcon" />
        </button>
      </div>
    </div>
  );
};

export default OX;
