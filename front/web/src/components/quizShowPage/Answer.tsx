interface AnswerProps {
    content: string;
    answer: string;
    commentary: string;
    onNext: () => void;
    isLastQuiz: boolean;
}

const Answer = ({ content, answer, commentary, onNext, isLastQuiz }: AnswerProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[40vw] h-[40vh] flex flex-col gap-3 bg-white rounded-xl p-6 shadow-xl">
                <h1 className="text-xl font-pre-medium text-main200">문제</h1>
                <p className="text-base">{content}</p>
                <h1 className="text-xl font-pre-medium text-main200">정답</h1>
                <p className="text-base">{answer}</p>
                <h1 className="text-xl font-pre-medium text-main200">해설</h1>
                <p className="text-base">{commentary}</p>
                <button 
                    onClick={onNext}
                    className="mt-auto bg-normal text-white px-5 py-2 rounded-lg text-base font-pre-medium hover:bg-main300 transition-colors"
                >
                    {isLastQuiz ? '결과보기' : '다음 문제'}
                </button>
            </div>
        </div>
    );
};

export default Answer;
