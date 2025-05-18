import { useState } from "react";

interface ObjectiveProps {
  content: string;
  answer: string;
  showAnswer: boolean;
  onAnswerSelect: (answer: string) => void;
  isCorrect?: boolean; // 사용자가 제출한 답이 정답인지 여부
  inputValue?: string; // 부모 컴포넌트에서 관리하는 입력값
}

const Objective = ({
  content,
  answer,
  showAnswer,
  onAnswerSelect,
  isCorrect,
  inputValue: externalInputValue,
}: ObjectiveProps) => {
  // 내부 상태는 외부에서 전달받은 입력값으로 초기화
  const [internalInputValue, setInternalInputValue] = useState<string>(externalInputValue || "");

  // 실제 사용할 입력값 (외부 상태 우선)
  const inputValue = externalInputValue !== undefined ? externalInputValue : internalInputValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showAnswer) return; // showAnswer가 true일 때 입력 변경 불가

    const value = e.target.value;
    // 내부 상태도 업데이트 (폴백용)
    setInternalInputValue(value);
    onAnswerSelect(value);
  };

  // 정답/오답에 따른 스타일 지정
  const getInputStyle = () => {
    if (!showAnswer) {
      return "border-gray100 focus:border-main200";
    }

    if (inputValue.trim() === "") {
      return "border-gray100";
    }

    // 입력값이 정답인 경우 또는 isCorrect가 true인 경우
    if (isCorrect === true) {
      return "border-green-500 bg-green-100 text-green-800";
    }
    // 입력값이 오답인 경우
    else if (isCorrect === false) {
      return "border-red-500 bg-red-100 text-red-800";
    }

    return "border-gray100";
  };

  return (
    <div>
      <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium flex items-center justify-center">
        {content}
      </div>
      <div className="relative">
        <input
          className={`
                      block mx-auto mt-20 w-1/2 h-12 px-4 py-2
                      text-20 font-pre-medium
                      rounded-xl border-2 ${getInputStyle()}
                      focus:outline-none
                      placeholder-gray-400
                      shadow-sm
                  `}
          type="text"
          placeholder="정답을 입력하세요..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={showAnswer}
        />
        {showAnswer && isCorrect === false && inputValue.trim() !== "" && (
          <div className="mt-2 mx-auto w-1/2 p-2 rounded-xl border-2 border-green-500 bg-green-100 text-green-800 text-center">
            정답: {answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Objective;
