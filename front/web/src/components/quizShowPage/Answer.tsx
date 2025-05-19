interface AnswerProps {
  content: string;
  answer: string;
  isCorrect: boolean;
  commentary: string;
  onNext: () => void;
  isLastQuiz: boolean;
}

const Answer = ({ content, answer, commentary, onNext, isLastQuiz, isCorrect }: AnswerProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="w-full md:w-[40vw] max-h-[90vh] overflow-y-auto flex flex-col gap-4 bg-white rounded-xl p-4 md:p-6 shadow-xl">
        <div
          className={`text-center p-3 md:p-4 rounded-lg mb-2 md:mb-4 ${isCorrect ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"}`}
        >
          <h2
            className={`text-20 md:text-24 font-pre-bold ${isCorrect ? "text-[#16A34A]" : "text-[#DC2626]"}`}
          >
            {isCorrect ? "정답입니다! 🎉" : "오답입니다 😢"}
          </h2>
        </div>
        <div>
          <h1 className="text-18 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">문제</span>
          </h1>
          <p className="text-14 md:text-16 p-2">{content}</p>
        </div>
        <div>
          <h1 className="text-18 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">정답</span>
          </h1>
          <p
            className={`text-14 md:text-16 p-2 ${isCorrect ? "text-[#16A34A]" : "text-[#DC2626]"} font-pre-medium`}
          >
            {answer}
          </p>
        </div>
        <div>
          <h1 className="text-18 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">해설</span>
          </h1>
          <p className="text-14 md:text-16 p-2">{commentary}</p>
        </div>
        <div className="flex justify-center w-full mt-2 md:mt-4">
          <button
            onClick={onNext}
            className="w-full md:w-1/2 bg-normal text-white px-4 md:px-5 py-2 rounded-lg text-14 md:text-16 font-pre-medium transition-transform duration-200 hover:scale-110"
          >
            {isLastQuiz ? "결과보기" : "다음 문제"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Answer;
