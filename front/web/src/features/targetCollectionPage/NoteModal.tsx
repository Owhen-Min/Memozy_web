import closeIcon from "../../assets/icons/closeIcon.svg";
import CustomReactMarkdown from "./markDownToMarkUp";

interface NoteModalProps {
  sourceTitle: string;
  summary: string;
  onClose: () => void;
}

function NoteModal({ sourceTitle, summary, onClose }: NoteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[800px] w-full mx-4 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 transition-transform duration-200 hover:scale-110"
        >
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-20 font-pre-semibold text-main200">
            개념 요약 노트 -
            <span className="text-20 font-pre-semibold text-normalactive">{sourceTitle}</span>
          </h2>
        </div>
        <div className="bg-bg rounded-xl p-4 overflow-y-auto flex-1">
          <div className="text-16 font-pre-regular text-main200">
            <CustomReactMarkdown>{summary}</CustomReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
