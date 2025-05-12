import { useParams } from "react-router";
import MemozyCard from "../features/targetCollectionPage/MemozyCard";
import { useState, useEffect, useCallback } from "react";
import CreateQuizShowModal from "../features/targetCollectionPage/CreateQuizShowModal";
import memozyIcon from "../assets/icons/memozyIcon.png";
import DeleteMemozyModal from "../features/targetCollectionPage/DeleteMemozyModal";
import CopyMemozyModal from "../features/targetCollectionPage/CopyMemozyModal";
import { Memozy } from "../stores/collection/types";
import { useCollectionStore } from "../stores/collection/collectionStore";

function TargetCollectionPage() {
  const { collectionId } = useParams();
  const {
    collectionName,
    memozies = [],
    fetchMemozyList,
    loading,
    currentPage,
    hasMore,
    setPage,
  } = useCollectionStore();
  const memozyCount = memozies?.length ?? 0;
  const quizCount =
    memozies?.reduce((sum: number, item: Memozy) => sum + (item.quizCount ?? 0), 0) ?? 0;
  const [isQuizShowModalOpen, setIsQuizShowModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMemozyIds, setSelectedMemozyIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // 무한 스크롤을 위한 옵저버 설정
  const observer = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null && !loading && hasMore) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setPage(currentPage + 1);
              if (collectionId) {
                fetchMemozyList(Number(collectionId), currentPage + 1);
              }
            }
          },
          { threshold: 1.0 }
        );
        observer.observe(node);
        return () => observer.disconnect();
      }
    },
    [loading, hasMore, currentPage, collectionId, fetchMemozyList, setPage]
  );

  useEffect(() => {
    if (collectionId) {
      // 페이지 초기화 후 첫 페이지 로드
      setPage(0);
      fetchMemozyList(Number(collectionId), 0);
    }
  }, [collectionId, fetchMemozyList, setPage]);

  const handleMemozySelect = (memozyId: number) => {
    setSelectedMemozyIds((prev) =>
      prev.includes(memozyId) ? prev.filter((id) => id !== memozyId) : [...prev, memozyId]
    );
  };

  return (
    <>
      <div className="content">
        <h1 className="text-[36px] font-pre-bold text-normalactive active:text-main200">
          {collectionName}
          <span className="text-[20px] font-pre-medium text-main200 pl-2">컬렉션</span>
        </h1>
        <hr className="border-t border-gray100 my-4" />
        <div className="flex gap-2 mb-4 justify-between">
          <div className="flex items-center gap-2">
            <img src={memozyIcon} alt="메모지" className="w-5 h-5" />
            <span className="text-16 font-pre-semibold">Memozy 수</span>
            <span className="text-16 font-pre-semibold text-normal">{memozyCount}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsQuizShowModalOpen(true)}
              className="text-16 font-pre-medium text-white bg-normal rounded-xl px-4 py-1"
              disabled={loading}
            >
              퀴즈쇼 생성
            </button>
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                if (!isEditMode) {
                  setSelectedMemozyIds([]);
                }
              }}
              className={`text-16 font-pre-medium ${isEditMode ? "text-white bg-normal" : "text-normal bg-white"} rounded-xl px-4 py-1 border border-normal`}
              disabled={loading}
            >
              {isEditMode ? "Memozy 편집 완료" : "Memozy 편집"}
            </button>
          </div>
        </div>
        {isEditMode && (
          <div className="flex gap-4 mb-4">
            <button
              className="border border-normal text-normal bg-bg rounded-xl px-4 py-1 font-pre-medium text-[16px] transition-colors hover:bg-normal hover:text-white"
              onClick={() => setIsCopyModalOpen(true)}
            >
              <span className="font-pre-bold">선택 Memozy 복제</span>
            </button>
            <button
              className="border border-red text-red bg-bg rounded-xl px-4 py-1 font-pre-medium text-[16px] transition-colors hover:bg-red hover:text-white"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <span className="font-pre-bold">선택 Memozy 삭제</span>
            </button>
          </div>
        )}
        {loading && memozies.length === 0 ? (
          <div className="text-center py-4">로딩 중...</div>
        ) : memozies.length === 0 ? (
          <div className="text-center py-4">메모지가 없습니다.</div>
        ) : (
          <>
            {memozies.map((content: Memozy) => (
              <MemozyCard
                key={content.sourceId}
                sourceId={content.sourceId}
                sourceTitle={content.sourceTitle}
                summary={content.summary}
                quizCount={content.quizCount}
                isEditMode={isEditMode}
                isSelected={selectedMemozyIds.includes(content.sourceId)}
                onSelect={() => handleMemozySelect(content.sourceId)}
              />
            ))}
            {/* 무한 스크롤을 위한 옵저버 요소 */}
            <div ref={observer} className="h-4" />
            {loading && <div className="text-center py-4">추가 메모지 로딩 중...</div>}
          </>
        )}
      </div>

      {isQuizShowModalOpen && (
        <CreateQuizShowModal
          onClose={() => setIsQuizShowModalOpen(false)}
          collectionId={collectionId}
          quizCount={quizCount}
          collectionName={collectionName ?? ""}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteMemozyModal
          memozyIds={selectedMemozyIds}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {isCopyModalOpen && (
        <CopyMemozyModal memozyIds={selectedMemozyIds} onClose={() => setIsCopyModalOpen(false)} />
      )}
    </>
  );
}

export default TargetCollectionPage;
