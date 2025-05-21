import { useState, useEffect } from "react";
import closeIcon from "../../assets/icons/closeIcon.svg";
import { useCollectionStore } from "../../stores/collection/collectionStore";
import { useParams, useNavigate } from "react-router";

interface CopyMemozyModalProps {
  memozyIds: number[];
  onClose: () => void;
}

function CopyMemozyModal({ memozyIds, onClose }: CopyMemozyModalProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const { collections, copyMemozy, fetchCollections } = useCollectionStore();
  const { collectionId } = useParams();
  const currentCollectionId = Number(collectionId);
  const navigate = useNavigate();

  // 복제 가능한 컬렉션이 있는지 확인
  const hasAvailableCollections = collections.some((col) => col.id !== currentCollectionId);

  useEffect(() => {
    // 현재 컬렉션이 아닌 첫 번째 컬렉션을 선택
    const firstAvailableCollection = collections.find((col) => col.id !== currentCollectionId);
    if (firstAvailableCollection) {
      setSelectedCollectionId(firstAvailableCollection.id);
    }
  }, [collections, currentCollectionId]);

  const handleCopy = async () => {
    if (!selectedCollectionId) return;

    try {
      await copyMemozy(selectedCollectionId, memozyIds, currentCollectionId);
      await fetchCollections(); // 전체 컬렉션 목록 새로고침
      onClose();
      navigate(`/collection/${selectedCollectionId}`);
    } catch (err) {
      console.error("메모지 복제 중 오류 발생:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
      <button onClick={onClose} className="absolute top-4 right-4">
        <img src={closeIcon} alt="close" className="w-3 h-3" />
      </button>
      <h1 className="text-20 font-pre-bold text-center mb-4">
        <span className="font-pre-bold">Memozy 복제하기</span>
      </h1>
      {hasAvailableCollections ? (
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-16 font-pre-medium mb-8 focus:outline-none focus:ring-2 focus:ring-main200"
          value={selectedCollectionId ?? ""}
          onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
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
      ) : (
        <p className="w-full text-center text-16 font-pre-medium mb-4 text-gray-500"></p>
      )}
      <button
        onClick={handleCopy}
        disabled={!selectedCollectionId}
        className="w-full bg-normal text-white rounded-xl py-2 font-pre-medium text-16 hover:bg-normal/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {!hasAvailableCollections
          ? "복제 가능한 컬렉션이 없습니다"
          : selectedCollectionId
            ? "해당 컬렉션에 복제"
            : "복제할 컬렉션을 선택해주세요."}
      </button>
    </div>
  );
}

export default CopyMemozyModal;
