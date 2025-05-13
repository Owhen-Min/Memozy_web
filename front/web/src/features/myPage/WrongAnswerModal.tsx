import { useState } from "react";
import { QuizHistoryData, QuizHistory, QuizDetail } from "../../types/wrongAnswer.ts";
import openfolder from "../../assets/images/openfolder.png";
import dropDownIcon from "../../assets/icons/dropDownIcon.svg";
import closeIcon from "../../assets/icons/closeIcon.svg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizHistoryData | null;
  isLoading: boolean;
}

function Modal({ isOpen, onClose, data, isLoading }: ModalProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleDropDown = (id: number) => {
    setIsDropDownOpen(isDropDownOpen === id ? null : id);
  };

  // 바깥 영역 클릭 시 모달 닫기 처리
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 현재 이벤트가 발생한 요소가 바깥 영역(overlay)인 경우에만 닫기
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  // 로딩 중이거나 데이터가 없을 때 표시할 내용
  if (isLoading || !data) {
    return (
      <div
        className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center font-pre-regular"
        onClick={handleOutsideClick}
      >
        <div className="bg-blue-50 p-8 rounded-lg w-[70%] h-[90%] overflow-y-auto relative shadow-lg">
          <button onClick={onClose} className="absolute top-4 right-4 text-xl">
            <img src={closeIcon} alt="닫기" />
          </button>
          <div className="flex items-center justify-center h-full">
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center font-pre-regular"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-blue-50 p-8 rounded-lg w-[70%] h-[90%] overflow-y-auto relative shadow-lg scrollbar-hide"
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 전파 방지
      >
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
        {data.data.length === 0 ? (
          <div className="text-center p-10">
            <p>오답 내역이 없습니다.</p>
          </div>
        ) : (
          data.data.map((history: QuizHistory) => (
            <div
              key={history.historyId}
              className="mb-4 p-4 bg-white rounded-lg shadow-md"
              onClick={() => toggleDropDown(history.historyId)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-pre-bold text-lg">{history.round}회차</h3>
                <div className="flex items-center">
                  <button className="p-2 hover:bg-light rounded-lg transition-colors">
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
                <p className="text-sm text-gray-600">틀린 퀴즈 개수: {history.failCount}</p>
                <p className="text-sm text-gray-500">{history.date}</p>
              </div>
              {isDropDownOpen === history.historyId && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">{history.date}</p>
                  {history.quizDataList && history.quizDataList.length > 0 ? (
                    history.quizDataList.map((quiz: QuizDetail, index) => (
                      <div
                        key={`${history.historyId}-${quiz.quizId}-${index}`}
                        className="mt-2 p-3 bg-gray-100 rounded-md"
                      >
                        <h4 className="font-pre-semibold">{quiz.content}</h4>
                        {quiz.type === "MULTIPLE_CHOICE" && quiz.choice && (
                          <div className="pl-5">
                            {quiz.choice.map((option, index) => (
                              <p
                                key={index}
                                className={
                                  quiz.userSelect && option === quiz.userSelect ? "text-red" : ""
                                }
                              >
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
                        </div>
                        <div className="mt-2 p-2 bg-[#FEE9EB] rounded-md">
                          <p className="text-12">해설: {quiz.commentary}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>퀴즈 데이터가 없습니다.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Modal;
