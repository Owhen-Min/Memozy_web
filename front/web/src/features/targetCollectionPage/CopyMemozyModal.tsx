import { useState, useEffect } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";
import { useCollectionStore } from "../../stores/collection/collectionStore";
import { useParams } from "react-router";

interface CopyMemozyModalProps {
  memozyIds: number[];
  onClose: () => void;
}

function CopyMemozyModal({ memozyIds, onClose }: CopyMemozyModalProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const { collections, fetchCollections, copyMemozy, loading, error } = useCollectionStore();
  const { collectionId } = useParams();
  const currentCollectionId = Number(collectionId);

  useEffect(() => {
    fetchCollections();
    // 현재 컬렉션이 아닌 첫 번째 컬렉션을 선택
    const firstAvailableCollection = collections.find((col) => col.id !== currentCollectionId);
    if (firstAvailableCollection) {
      setSelectedCollectionId(firstAvailableCollection.id);
    }
  }, [collections.length, fetchCollections, currentCollectionId]);

  const handleCopy = async () => {
    if (!selectedCollectionId) return;

    try {
      await copyMemozy(selectedCollectionId, memozyIds);
      onClose();
    } catch (err) {
      console.error("메모지 복제 중 오류 발생:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>
        <h1 className="text-20 font-pre-bold text-center mb-4">
          <span className="font-pre-bold">Memozy 복제하기</span>
        </h1>
        {error && <p className="text-red-500 text-14 mb-4">{error}</p>}
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-16 font-pre-medium mb-8 focus:outline-none focus:ring-2 focus:ring-main200"
          value={selectedCollectionId ?? ""}
          onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
          disabled={loading}
        >
          {collections.map((col) => (
            <option
              key={col.id}
              value={col.id}
              disabled={col.id === currentCollectionId}
              className={col.id === currentCollectionId ? "text-gray-400" : ""}
            >
              {col.name} {col.id === currentCollectionId ? "(현재 컬렉션)" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleCopy}
          disabled={loading || !selectedCollectionId}
          className="w-full bg-normal text-white rounded-xl py-2 font-pre-medium text-16 hover:bg-normal/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "복제 중..." : "해당 컬렉션에 복제"}
        </button>
      </div>
    </div>
  );
}

export default CopyMemozyModal;
