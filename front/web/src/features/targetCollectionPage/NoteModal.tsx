import closeIcon from "../../assets/icons/closeIcon.svg";

interface NoteModalProps {
  urlTitle: string;
  summary: string;
  onClose: () => void;
}

function NoteModal({ urlTitle, summary, onClose }: NoteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-[800px] w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-60">
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-pre-semibold text-main200">
            개념 요약 노트 -{" "}
            <span className="text-[20px] font-pre-semibold text-normalactive">{urlTitle}</span>
          </h2>
        </div>
        <div className="bg-bg rounded-xl p-4">
          <p className="text-[16px] font-pre-regular text-main200 whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
