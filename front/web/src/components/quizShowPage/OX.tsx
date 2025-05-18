import { useState, useEffect } from "react";
import OIcon from "../../assets/icons/OIcon.svg";
import XIcon from "../../assets/icons/XIcon.svg";
import Answer from "./Answer";

interface OXProps {
  content: string;
  answer: string;
  isCorrect: boolean;
  commentary: string;
  quizSessionId: string;
  showAnswer: boolean;
  onNext: () => void;
  isLastQuiz: boolean;
  onAnswerSelect: (answer: "O" | "X") => void;
}

const OX = ({
  content,
  answer,
  isCorrect,
  commentary,
  showAnswer,
  onNext,
  isLastQuiz,
  onAnswerSelect,
}: OXProps) => {
  const [selected, setSelected] = useState<null | "O" | "X">(null);

  useEffect(() => {
    if (showAnswer) {
      setSelected(null);
    }
  }, [showAnswer]);

  const handleSelect = (value: "O" | "X") => {
    setSelected(value);
    onAnswerSelect(value);
  };

  return (
    <div>
      <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium flex items-center justify-center">
        {content}
      </div>
      <div className="w-full flex justify-center gap-32">
        <button
          className={`transition-transform duration-200 hover:scale-110 rounded-xl p-4
                        ${selected === "O" ? "bg-light" : ""}`}
          onClick={() => handleSelect("O")}
        >
          <img className="w-[150px] h-[150px]" src={OIcon} alt="OIcon" />
        </button>
        <button
          className={`transition-transform duration-200 hover:scale-110 rounded-xl p-4
                        ${selected === "X" ? "bg-light" : ""}`}
          onClick={() => handleSelect("X")}
        >
          <img className="w-[150px] h-[150px]" src={XIcon} alt="XIcon" />
        </button>
      </div>
      {showAnswer && (
        <Answer
          content={content}
          answer={answer}
          isCorrect={isCorrect}
          commentary={commentary}
          onNext={onNext}
          isLastQuiz={isLastQuiz}
        />
      )}
    </div>
  );
};

export default OX;
