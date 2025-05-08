import { useState } from "react";
import {
  QuizHistoryData,
  QuizHistory,
  QuizDetail,
} from "../../types/wrongAnswer.ts";
import openfolder from "../../assets/images/openfolder.png";
import dropDownIcon from "../../assets/icons/dropDownIcon.svg";
import closeIcon from "../../assets/icons/closeIcon.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizHistoryData | null;
}

function Modal({ isOpen, onClose, data }: ModalProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<number | null>(null);

  if (!isOpen || !data) return null;

  const toggleDropDown = (id: number) => {
    setIsDropDownOpen(isDropDownOpen === id ? null : id);
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center font-pre-regular">
      <div className="bg-blue-50 p-8 rounded-lg w-[70%] h-[90%] overflow-y-auto relative shadow-lg scrollbar-hide">
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          <img src={closeIcon} alt="닫기" />
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
            <div className="flex justify-between items-center">
              <h3 className="font-pre-bold text-lg">{history.회차}</h3>
              <div className="flex items-center">
                <button
                  onClick={() => toggleDropDown(history.historyId)}
                  className="p-2 hover:bg-light rounded-lg transition-colors"
                >
                  <img
                    src={dropDownIcon}
                    alt="드롭다운 아이콘"
                    className={`w-6 transition-transform duration-200 ${
                      isDropDownOpen === history.historyId ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">
                틀린 퀴즈 개수: {history.failCount}
              </p>
              <p className="text-sm text-gray-500">{history.date}</p>
            </div>
            {isDropDownOpen === history.historyId && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">{history.date}</p>
                {history.quizDatas.map((quiz: QuizDetail) => (
                  <div
                    key={quiz.quizId}
                    className="mt-2 p-3 bg-gray-100 rounded-md"
                  >
                    <h4 className="font-pre-semibold">{quiz.content}</h4>
                    {quiz.type === "MULTIPLE_CHOICE" && quiz.choice && (
                      <div className="pl-5">
                        {quiz.choice.map((option, index) => (
                          <p key={index}>
                            {index + 1}) {option}
                          </p>
                        ))}
                      </div>
                    )}
                    {quiz.type === "OX" && <p>선택지: O, X</p>}
                    <div className="flex justify-between mt-2">
                      <div className="p-2 bg-green-100 rounded-md">
                        <p className="text-12 ">정답: {quiz.answer}</p>
                      </div>
                      <div className="p-2 bg-red-100 rounded-md">
                        <p className="text-12">내 오답: {quiz.userSelect}</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-[#FEE9EB] rounded-md">
                      <p className="text-12 text-red-700">
                        해설: {quiz.commentary}
                      </p>
                    </div>
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
