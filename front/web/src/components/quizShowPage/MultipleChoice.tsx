import { useState } from "react";
import Answer from "./Answer";

interface MultipleChoiceProps {
    content: string;
    choice: string[] | null;
    answer: string;
    commentary: string;
    quizSessionId: string;
    showAnswer: boolean;
    onNext: () => void;
    isLastQuiz: boolean;
}

const MultipleChoice = ({ content, choice, answer, commentary, showAnswer, onNext, isLastQuiz }: MultipleChoiceProps) => {
    const [selected, setSelected] = useState<number | null>(null);
    return(
        <div>
            <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium">
                문제 내용 : {content}
            </div>
            <div className="w-full flex flex-col gap-2">
                {choice?.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full text-left px-6 py-2 rounded-lg border transition font-medium text-base
                            ${selected === index ? 'bg-light text-main200' : 'bg-white border-gray-200 text-gray-800'}
                            hover:border-lighthover hover:bg-lighthover`}
                        onClick={() => setSelected(index)}
                    >
                        {index + 1}. {item}
                    </button>
                ))}
            </div>
            {showAnswer && (
                <Answer 
                    content={content}
                    answer={answer}
                    commentary={commentary}
                    onNext={onNext}
                    isLastQuiz={isLastQuiz}
                />
            )}
        </div>
    );
};

export default MultipleChoice;


