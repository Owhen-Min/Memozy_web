import Answer from "./Answer";

interface ObjectiveProps {
    content: string;
    answer: string;
    commentary: string;
    quizSessionId: string;
    showAnswer: boolean;
    onNext: () => void;
    isLastQuiz: boolean;
}   

const Objective = ({ content, answer, commentary, showAnswer, onNext, isLastQuiz }: ObjectiveProps) => {
    return(
        <div>
            <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium">
                문제 내용 : {content}
            </div>
            <input
                className="
                    block mx-auto mt-20 w-1/2 h-12 px-4 py-2
                    text-20 font-pre-medium text-main200
                    rounded-xl border-2 border-gray100
                    focus:outline-none focus:border-main200
                    placeholder-gray-400
                    shadow-sm
                "
                type="text"
                placeholder="정답을 입력하세요..."
            />
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

export default Objective;


