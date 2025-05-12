import { useState, useEffect } from "react";
import { collectionData } from "../../dummy/collectionData";
import closeIcon from "../../assets/icons/closeIcon.svg";
interface CopyMemozyModalProps {
  memozyIds: number[];
  onClose: () => void;
}

function CopyMemozyModal({ memozyIds, onClose }: CopyMemozyModalProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [collections, setCollections] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // 실제 API 연동 시 axios로 대체
    setCollections(collectionData.data.map((col) => ({ id: col.id, name: col.name })));
    if (collectionData.data.length > 0) {
      setSelectedCollectionId(collectionData.data[0].id);
    }
  }, []);

  const handleCopy = () => {
    console.log("복제 대상 memozy : ", memozyIds, "복제 도착 컬렉션 : ", selectedCollectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>
        <h1 className="text-[20px] font-pre-bold text-center mb-4">
          <span className="font-pre-bold">Memozy 복제하기</span>
        </h1>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[16px] font-pre-medium mb-8 focus:outline-none focus:ring-2 focus:ring-main200"
          value={selectedCollectionId ?? ""}
          onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
        >
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleCopy}
          className="w-full bg-normal text-white rounded-xl py-2 font-pre-medium text-[16px] hover:bg-normal/90 transition-colors"
        >
          해당 컬렉션에 복제
        </button>
      </div>
    </div>
  );
}

export default CopyMemozyModal;
