import { useParams } from "react-router";
import MemozyCard from "../features/targetCollectionPage/MemozyCard";
import { useState, useEffect, useCallback, useRef } from "react";
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
    duplicateQuizCount,
    memozies = [],
    fetchMemozyList,
    fetchAllMemozyList,
    loading,
    currentPage,
    hasMore,
    setPage,
    allCollection,
    fetchAllCollection,
  } = useCollectionStore();
  const memozyCount = memozies?.length ?? 0;
  const quizCount =
    collectionId === "0"
      ? (allCollection?.quizCount ?? 0)
      : (memozies?.reduce((sum: number, item: Memozy) => sum + (item.quizCount ?? 0), 0) ?? 0);
  const [isQuizShowModalOpen, setIsQuizShowModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMemozyIds, setSelectedMemozyIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const observerNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && hasMore && observerNodeRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading && hasMore) {
            setPage(currentPage + 1);
            if (collectionId) {
              const collectionIdNum = Number(collectionId);
              if (collectionIdNum === 0) {
                fetchAllMemozyList(currentPage + 1);
              } else {
                fetchMemozyList(collectionIdNum, currentPage + 1);
              }
            }
          }
        },
        { threshold: 1.0 }
      );

      observerRef.current.observe(observerNodeRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, currentPage, collectionId, fetchMemozyList, fetchAllMemozyList, setPage]);

  // observer 콜백 함수를 단순화
  const observer = useCallback((node: HTMLDivElement | null) => {
    observerNodeRef.current = node;
  }, []);

  useEffect(() => {
    if (collectionId) {
      // 페이지 초기화 후 첫 페이지 로드
      setPage(0);
      const collectionIdNum = Number(collectionId);
      if (collectionIdNum === 0) {
        fetchAllMemozyList(0);
        fetchAllCollection(); // 전체 컬렉션 정보 가져오기
      } else {
        fetchMemozyList(collectionIdNum, 0);
      }
    }
  }, [collectionId, fetchMemozyList, fetchAllMemozyList, fetchAllCollection, setPage]);

  const handleMemozySelect = (memozyId: number) => {
    setSelectedMemozyIds((prev) =>
      prev.includes(memozyId) ? prev.filter((id) => id !== memozyId) : [...prev, memozyId]
    );
  };

  const handleOpenModal = (modalType: "copy" | "delete") => {
    if (selectedMemozyIds.length === 0) {
      alert("Memozy를 선택해주세요.");
      return;
    }

    if (modalType === "copy") {
      setIsCopyModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseModalAndEndEditMode = () => {
    setIsDeleteModalOpen(false);
    setIsCopyModalOpen(false);
    setIsEditMode(false);
    setSelectedMemozyIds([]);
  };

  // 바깥 영역 클릭 시 모달 닫기 처리
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 현재 이벤트가 발생한 요소가 바깥 영역(overlay)인 경우에만 닫기
    if (e.type === "mousedown" && e.currentTarget === e.target) {
      setIsQuizShowModalOpen(false);
      setIsDeleteModalOpen(false);
      setIsCopyModalOpen(false);
    }
  };

  return (
    <>
      <div className="content">
        <h1 className="text-[36px] font-pre-bold text-normalactive active:text-main200 flex flex-wrap items-center">
          <span
            className="truncate w-full md:w-auto md:max-w-xl inline-block hover:whitespace-normal hover:break-all"
            title={collectionName ?? ""}
          >
            {collectionName}
          </span>
        </h1>
        <hr className="border-t border-gray100 my-4" />
        <div className="flex gap-2 mb-4 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={memozyIcon} alt="메모지" className="w-5 h-5" />
              <span className="text-16 font-pre-semibold">Memozy</span>
              <span className="text-16 font-pre-semibold text-normal">{memozyCount}</span>
            </div>
            <span className="text-16 font-pre-semibold text-gray200">
              {duplicateQuizCount}개의 중복 퀴즈
            </span>
          </div>
          {memozies.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsQuizShowModalOpen(true)}
                className="text-16 font-pre-medium text-white bg-normal rounded-xl px-4 py-1"
                disabled={loading}
              >
                퀴즈쇼 생성
              </button>
              {collectionId !== "0" && (
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
                  {isEditMode ? "편집 완료" : "편집"}
                </button>
              )}
            </div>
          )}
        </div>
        {isEditMode && memozies.length > 0 && (
          <div className="flex gap-4 mb-4">
            <button
              className="border border-normal text-normal bg-bg rounded-xl px-4 py-1 font-pre-medium text-16 transition-colors hover:bg-normal hover:text-white"
              onClick={() => handleOpenModal("copy")}
            >
              <span className="font-pre-bold">선택 Memozy 복제</span>
            </button>
            <button
              className="border border-red text-red bg-bg rounded-xl px-4 py-1 font-pre-medium text-16 transition-colors hover:bg-red hover:text-white"
              onClick={() => handleOpenModal("delete")}
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
                url={content.url}
                collectionId={collectionId}
              />
            ))}
            {hasMore && !loading && <div ref={observer} className="h-4" />}
            {loading && <div className="text-center py-4">추가 메모지 로딩 중...</div>}
          </>
        )}
      </div>

      {isQuizShowModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onMouseDown={handleOutsideClick}
        >
          <CreateQuizShowModal
            onClose={() => setIsQuizShowModalOpen(false)}
            collectionId={collectionId}
            quizCount={quizCount}
            duplicateQuizCount={duplicateQuizCount}
          />
        </div>
      )}

      {isDeleteModalOpen && selectedMemozyIds.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onMouseDown={handleOutsideClick}
        >
          <DeleteMemozyModal
            quizId={null}
            sourceId={selectedMemozyIds}
            onClose={handleCloseModalAndEndEditMode}
          />
        </div>
      )}

      {isCopyModalOpen && selectedMemozyIds.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onMouseDown={handleOutsideClick}
        >
          <CopyMemozyModal memozyIds={selectedMemozyIds} onClose={handleCloseModalAndEndEditMode} />
        </div>
      )}
    </>
  );
}

export default TargetCollectionPage;
