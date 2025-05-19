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
          <button onClick={onClose} className="absolute top-4 right-4 text-20">
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
        className="bg-blue-50 p-4 md:p-8 rounded-lg w-[95%] md:w-[70%] h-[90%] overflow-y-auto relative shadow-lg scrollbar-hide mt-14"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
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
        <button
          onClick={onClose}
          className="absolute top-2 md:top-4 right-2 md:right-4 text-16 md:text-20"
        >
          <img src={closeIcon} alt="닫기" className="w-4" />
        </button>
        <div className="flex items-center mb-4 md:mb-6">
          <img src={openfolder} alt="폴더" className="w-8 md:w-8 mr-2" />
          <h2 className="text-20 md:text-24 font-bold">{data.name}</h2>
        </div>
        {data.data.length === 0 ? (
          <div className="text-center p-6 md:p-10">
            <p className="text-14 md:text-16">오답 내역이 없습니다.</p>
          </div>
        ) : (
          data.data.map((history: QuizHistory) => (
            <div
              key={history.historyId}
              className="mb-3 md:mb-4 p-3 md:p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-pre-bold text-16 md:text-[18px]">{history.round}회차</h3>
                <div className="flex items-center">
                  <button
                    className="p-1 md:p-2 hover:bg-light rounded-lg transition-colors"
                    onClick={() => toggleDropDown(history.historyId)}
                  >
                    <img
                      src={dropDownIcon}
                      alt="드롭다운 아이콘"
                      className={`w-4 md:w-6 transition-transform duration-200 ${
                        isDropDownOpen === history.historyId ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between mt-1 md:mt-0">
                <p className="text-12 md:text-14 text-gray-600">
                  전체 퀴즈 개수: 틀린 퀴즈 개수:{history.failCount}
                </p>
                <p className="text-12 md:text-14 text-gray-500 mt-1 md:mt-0">{history.date}</p>
              </div>
              {isDropDownOpen === history.historyId && (
                <div className="mt-3 md:mt-4">
                  {history.quizDataList && history.quizDataList.length > 0 ? (
                    history.quizDataList.map((quiz: QuizDetail, index) => (
                      <div
                        key={`${history.historyId}-${quiz.quizId}-${index}`}
                        className="mt-2 p-2 md:p-3 bg-gray-100 rounded-md"
                      >
                        <h4 className="font-pre-semibold text-14 md:text-16">{quiz.content}</h4>
                        {quiz.type === "MULTIPLE_CHOICE" && quiz.choice && (
                          <div className="pl-3 md:pl-5 mt-1">
                            {quiz.choice.map((option, index) => (
                              <p
                                key={index}
                                className={`text-12 md:text-14 ${
                                  quiz.userSelect && option === quiz.userSelect ? "text-red" : ""
                                }`}
                              >
                                {index + 1}) {option}
                              </p>
                            ))}
                          </div>
                        )}
                        {quiz.type === "OX" && (
                          <p className="text-12 md:text-14 mt-1">선택지: O, X</p>
                        )}
                        <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-2">
                          <div className="p-2 bg-green-100 rounded-md">
                            <p className="text-10 md:text-14">정답: {quiz.answer}</p>
                          </div>
                        </div>
                        <div className="mt-2 p-2 bg-[#FEE9EB] rounded-md">
                          <p className="text-10 md:text-14">해설: {quiz.commentary}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-12 md:text-14">퀴즈 데이터가 없습니다.</p>
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
