import { useState } from "react";
import {
  QuizHistoryData,
  QuizHistory,
  QuizDetail,
} from "../../types/wrongAnswer.ts";
import openfolder from "../../assets/images/openfolder.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizHistoryData | null;
}

function Modal({ isOpen, onClose, data }: ModalProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!isOpen || !data) return null;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center">
      <div className="bg-blue-50 p-8 rounded-lg w-[800px] h-[600px] overflow-y-auto relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          X
        </button>
        <div className="flex items-center mb-6">
          <img src={openfolder} alt="폴더" className="w-8 h-8 mr-2" />
          <h2 className="text-2xl font-bold">{data.name}</h2>
        </div>
        {data.data.map((history: QuizHistory) => (
          <div
            key={history.historyId}
            className="mb-4 p-4 bg-white rounded-lg shadow-md"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(history.historyId)}
            >
              <h3 className="font-pre-bold text-lg">{history.회차}</h3>
              <p className="text-sm text-gray-500">{history.date}</p>
            </div>
            <p className="text-sm text-gray-600">
              틀린 퀴즈 개수: {history.failCount}
            </p>
            {expandedId === history.historyId && (
              <div className="mt-4">
                {history.quizDatas.map((quiz: QuizDetail) => (
                  <div
                    key={quiz.quizId}
                    className="mt-2 p-3 bg-gray-100 rounded-md"
                  >
                    <h4 className="font-pre-semibold">{quiz.type}</h4>
                    <p className="text-red-500">내 오답: {quiz.userSelect}</p>
                    <p className="text-green-500">정답: {quiz.answer}</p>
                    <p className="text-gray-700">해설: {quiz.commentary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modal;
