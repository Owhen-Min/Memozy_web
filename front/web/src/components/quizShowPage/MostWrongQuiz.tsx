interface MostWrongQuizProps {
  content: string;
  answer: string;
  commentary: string;
  wrongRate: number;
  onClose: () => void;
}

const MostWrongQuiz = ({ content, answer, commentary, wrongRate, onClose }: MostWrongQuizProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 md:p-0">
      <div className="w-full max-w-[90vw] md:w-[40vw] md:max-w-none h-auto max-h-[90vh] md:max-h-[80vh] flex flex-col gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 shadow-xl overflow-y-auto">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-16 md:text-20 font-pre-medium text-main200">가장 많이 틀린 문제</h1>
          <span className="text-red text-12 md:text-14 font-pre-medium">
            오답률: {(wrongRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <h1 className="text-16 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">문제</span>
          </h1>
          <p className="text-14 md:text-16 p-2">{content}</p>
        </div>
        <div>
          <h1 className="text-16 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">정답</span>
          </h1>
          <p className="text-14 md:text-16 p-2">{answer}</p>
        </div>
        <div>
          <h1 className="text-16 md:text-20 font-pre-semibold text-normalactive pb-1">
            <span className="p-1 border-b-2 border-gray-200">해설</span>
          </h1>
          <p className="text-14 md:text-16 p-2">{commentary}</p>
        </div>
        <div className="flex justify-center w-full mt-2 md:mt-4">
          <button
            onClick={onClose}
            className="w-full md:w-1/2 bg-normal text-white px-5 py-2 rounded-lg text-base font-pre-medium transition-transform duration-200 hover:scale-110"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MostWrongQuiz;
