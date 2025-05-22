import { useState } from "react";
import summaryIcon from "../../assets/icons/summaryIcon.svg";
import dropDownIcon from "../../assets/icons/dropDownIcon.svg";
import NoteModal from "./NoteModal";
import DropDownBox from "./DropDownBox";
import urlIcon from "../../assets/icons/urlIcon.svg";

interface MemozyCardProps {
  sourceId: number;
  sourceTitle: string;
  summary: string;
  quizCount: number;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  url: string;
  collectionId?: string;
}

function MemozyCard({
  sourceId,
  sourceTitle,
  summary,
  quizCount,
  isEditMode,
  isSelected,
  onSelect,
  url,
  collectionId,
}: MemozyCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 바깥 영역 클릭 시 모달 닫기 처리
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 현재 이벤트가 발생한 요소가 바깥 영역(overlay)인 경우에만 닫기
    if (e.type === "mousedown" && e.currentTarget === e.target) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`w-full bg-white rounded-2xl shadow-md overflow-hidden ${isEditMode ? "cursor-pointer" : ""}`}
        onClick={() => isEditMode && onSelect()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 flex items-start gap-4">
              {isEditMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  className="w-5 h-5 mt-1 accent-normal"
                />
              )}
              <div>
                <h2 className="text-20 font-pre-semibold text-main200 mb-2 line-clamp-1">
                  {sourceTitle}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-14 font-pre-regular text-gray200">퀴즈 수</span>
                  <span className="text-14 font-pre-medium text-normal">{quizCount}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, "_blank");
                }}
                className="p-2 hover:bg-light rounded-lg transition-colors"
              >
                <img src={urlIcon} alt="url" className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="p-2 hover:bg-light rounded-lg transition-colors"
              >
                <img src={summaryIcon} alt="summary" className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropDownOpen(!isDropDownOpen);
                }}
                className="p-2 hover:bg-light rounded-lg transition-colors"
              >
                <img
                  src={dropDownIcon}
                  alt="dropdown"
                  className={`w-5 h-5 transition-transform duration-200 ${isDropDownOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropDownOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 md:hidden">
            <p className="text-16 break-words font-pre-semibold">{sourceTitle}</p>
          </div>
          <DropDownBox sourceId={sourceId} collectionId={collectionId} />
        </div>
      </div>
      <div className="h-4" />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="mt-14 w-full h-full flex items-center justify-center"
            onMouseDown={handleOutsideClick}
          >
            <NoteModal
              sourceTitle={sourceTitle}
              summary={summary}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MemozyCard;
