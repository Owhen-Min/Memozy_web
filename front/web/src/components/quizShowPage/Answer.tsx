interface AnswerProps {
  content: string;
  answer: string;
  commentary: string;
  onNext: () => void;
  isLastQuiz: boolean;
}

<<<<<<< HEAD
const Answer = ({
  content,
  answer,
  commentary,
  onNext,
  isLastQuiz,
}: AnswerProps) => {
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
          {isLastQuiz ? "결과보기" : "다음 문제"}
        </button>
      </div>
    </div>
  );
=======
const Answer = ({ content, answer, commentary, onNext, isLastQuiz }: AnswerProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[40vw] h-auto flex flex-col gap-4 bg-white rounded-xl p-6 shadow-xl">
                <div>
                    <h1 className="text-20 font-pre-semibold text-normalactive pb-1">
                        <span className="p-1 border-b-2 border-gray-200">문제</span>
                    </h1>
                    <p className="text-16 p-2">{content}</p>  
                </div>
                <div>
                    <h1 className="text-20 font-pre-semibold text-normalactive pb-1">
                        <span className="p-1 border-b-2 border-gray-200">정답</span>
                    </h1>
                    <p className="text-16 p-2">{answer}</p>
                </div>
                <div>
                    <h1 className="text-20 font-pre-semibold text-normalactive pb-1">
                        <span className="p-1 border-b-2 border-gray-200">해설</span>
                    </h1>
                    <p className="text-16 p-2">{commentary}</p>
                </div>
                <div className="flex justify-center w-full mt-4">
                    <button 
                        onClick={onNext}
                        className="w-1/2 bg-normal text-white px-5 py-2 rounded-lg text-base font-pre-medium transition-transform duration-200 hover:scale-110"
                    >
                        {isLastQuiz ? '결과보기' : '다음 문제'}
                    </button>
                </div>
            </div>
        </div>
    );
>>>>>>> 30db1d6e1d47ac4da29f8b73e8e7c2f41513a762
};

export default Answer;
