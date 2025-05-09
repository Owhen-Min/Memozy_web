import { useState } from "react";

interface MultipleChoiceProps {
    content: string;
    choice: string[] | null;
    answer: string;
    commentary: string;
    quizSessionId: string;
}

const MultipleChoice = ({ content, choice }: MultipleChoiceProps) => {
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
            {/* <div>정답 : {answer}</div>
            <div>해설 : {commentary}</div> */}
        </div>
    );
};

export default MultipleChoice;


