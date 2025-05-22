import { useState } from "react";

interface MultipleChoiceProps {
  content: string;
  choice: string[] | null;
  answer: string;
  showAnswer: boolean;
  onAnswerSelect: (answer: { index: number; value: string }) => void;
  isCorrect?: boolean; // 사용자가 제출한 답이 정답인지 여부
  selected?: number | null; // 부모 컴포넌트에서 관리하는 선택 상태
}

const MultipleChoice = ({
  content,
  choice,
  answer,
  showAnswer,
  onAnswerSelect,
  selected: externalSelected,
}: MultipleChoiceProps) => {
  // 내부 상태는 외부에서 전달받은 선택 상태로 초기화
  const [internalSelected, setInternalSelected] = useState<number | null>(
    externalSelected !== undefined ? externalSelected : null
  );

  // 실제 사용할 선택 상태 (외부 상태 우선)
  const selected = externalSelected !== undefined ? externalSelected : internalSelected;

  const handleSelect = (index: number) => {
    if (showAnswer) return; // showAnswer가 true일 때 선택 변경 불가

    // 내부 상태도 업데이트 (폴백용)
    setInternalSelected(index);
    if (choice) {
      onAnswerSelect({ index: index + 1, value: choice[index] });
    }
  };

  return (
    <div>
      <div className="w-full h-[160px] border-2 border-normal rounded-xl p-4 my-4 text-20 sm:text-24 font-pre-medium flex items-center justify-center">
        {content}
      </div>
      <div className="w-full flex flex-col gap-2">
        {choice?.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left px-6 py-2 rounded-lg border transition font-medium text-16 sm:text-20
                          ${
                            showAnswer
                              ? item === answer
                                ? "bg-green-100 text-green-800 border-green-500"
                                : selected === index
                                  ? "bg-red/10 text-red border-red"
                                  : "bg-white text-gray-800 border-gray-200"
                              : selected === index
                                ? "bg-light text-main200"
                                : "bg-white text-gray-800 border-gray-200"
                          }
                          ${!showAnswer ? "hover:border-lighthover hover:bg-lighthover" : ""}`}
            onClick={() => handleSelect(index)}
            disabled={showAnswer}
          >
            {index + 1}. {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoice;
