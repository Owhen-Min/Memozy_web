import closeIcon from "../../assets/icons/closeIcon.svg";
import CustomReactMarkdown from "./markDownToMarkUp";

interface NoteModalProps {
  sourceTitle: string;
  summary: string;
  onClose: () => void;
}

function NoteModal({ sourceTitle, summary, onClose }: NoteModalProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 w-[90%] sm:w-[95%] md:w-[800px] mx-4 relative max-h-[80vh] md:max-h-[90vh] flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 w-8 h-8 flex items-center justify-center transition-transform duration-200 hover:scale-110"
      >
        <img src={closeIcon} alt="close" className="w-4" />
      </button>
      <div className="flex flex-col mb-4">
        <h2 className="text-20 md:text-24 font-pre-semibold text-main200">개념 요약 노트</h2>
        <span className="text-[18px] md:text-20 font-pre-semibold text-normalactive mt-1">
          {sourceTitle}
        </span>
      </div>
      <div className="bg-bg rounded-xl p-3 md:p-4 overflow-y-auto flex-1 min-h-0">
        <div className="text-14 md:text-16 font-pre-regular text-main200">
          <CustomReactMarkdown>{summary}</CustomReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
