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

  // 사용자가 선택한 답변이 정답인지 확인
  const isCorrectAnswer = (index: number): boolean => {
    return choice ? choice[index] === answer : false;
  };

  // 정답 인덱스 찾기
  const getCorrectAnswerIndex = (): number | null => {
    if (!choice) return null;
    const index = choice.findIndex((item) => item === answer);
    return index !== -1 ? index : null;
  };

  return (
    <div>
      <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium flex items-center justify-center">
        {content}
      </div>
      <div className="w-full flex flex-col gap-2">
        {choice?.map((item, index) => {
          // 배경색 로직
          let bgColor = "bg-white";
          let textColor = "text-gray-800";
          let borderColor = "border-gray-200";

          if (showAnswer) {
            const isCorrectChoice = item === answer;
            const isSelectedChoice = selected === index;

            if (isCorrectChoice) {
              // 정답인 경우 항상 초록색으로 표시
              bgColor = "bg-green-100";
              borderColor = "border-green-500";
              textColor = "text-green-800";
            } else if (isSelectedChoice) {
              // 사용자가 선택했지만 오답인 경우 빨간색으로 표시 (isCorrect 확인 조건 제거)
              bgColor = "bg-red-100";
              borderColor = "border-red-500";
              textColor = "text-red-800";
            }
          } else if (selected === index) {
            bgColor = "bg-light";
            textColor = "text-main200";
          }

          return (
            <button
              key={index}
              className={`w-full text-left px-6 py-2 rounded-lg border transition font-medium text-base
                          ${bgColor} ${textColor} ${borderColor}
                          ${!showAnswer ? "hover:border-lighthover hover:bg-lighthover" : ""}`}
              onClick={() => handleSelect(index)}
              disabled={showAnswer}
            >
              {index + 1}. {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
