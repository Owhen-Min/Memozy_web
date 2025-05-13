import { useState } from "react";
import summaryIcon from "../../assets/icons/summaryIcon.svg";
import dropDownIcon from "../../assets/icons/dropDownIcon.svg";
import NoteModal from "./NoteModal";
import DropDownBox from "./DropDownBox";

interface MemozyCardProps {
  sourceId: number;
  sourceTitle: string;
  summary: string;
  quizCount: number;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

function MemozyCard({
  sourceId,
  sourceTitle,
  summary,
  quizCount,
  isEditMode,
  isSelected,
  onSelect,
}: MemozyCardProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 flex items-start gap-4">
              {isEditMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-light rounded-lg transition-colors"
              >
                <img src={summaryIcon} alt="summary" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
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
        >
          <DropDownBox sourceId={sourceId} />
        </div>
      </div>
      <div className="h-4" />
      {isModalOpen && (
        <NoteModal
          sourceTitle={sourceTitle}
          summary={summary}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default MemozyCard;
