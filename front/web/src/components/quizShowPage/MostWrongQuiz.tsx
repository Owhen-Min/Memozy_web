interface MostWrongQuizProps {
  content: string;
  answer: string;
  commentary: string;
  wrongRate: number;
  onClose: () => void;
}

const MostWrongQuiz = ({
  content,
  answer,
  commentary,
  wrongRate,
  onClose,
}: MostWrongQuizProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[40vw] h-[40vh] flex flex-col gap-3 bg-white rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-pre-medium text-main200">
            가장 많이 틀린 문제
          </h1>
          <span className="text-red text-sm font-pre-medium">
            오답률: {(wrongRate * 100).toFixed(0)}%
          </span>
        </div>
        <h1 className="text-xl font-pre-medium text-main200">문제</h1>
        <p className="text-base">{content}</p>
        <h1 className="text-xl font-pre-medium text-main200">정답</h1>
        <p className="text-base">{answer}</p>
        <h1 className="text-xl font-pre-medium text-main200">해설</h1>
        <p className="text-base">{commentary}</p>
        <button
          onClick={onClose}
          className="mt-auto bg-normal text-white px-5 py-2 rounded-lg text-base font-pre-medium hover:bg-main300 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default MostWrongQuiz;
