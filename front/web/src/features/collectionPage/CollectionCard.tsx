import memozyIcon from "../../assets/icons/memozyIcon.png";
import editIcon from "../../assets/icons/editIcon.png";
import trashIcon from "../../assets/icons/trashIcon.png";
// import { Collection } from '../../types/collection';
import { useNavigate } from "react-router";
import { useState } from "react";
import DeleteCollection from "./collectionPageModal/DeleteCollection";
import EditCollectionName from "./collectionPageModal/EditCollectionName";
import { useCollectionStore } from "../../stores/collection/collectionStore";

interface CollectionCardProps {
  id: number;
  name: string;
  memozyCount: number;
  quizCount: number;
}

function CollectionCard({ id, name, memozyCount, quizCount }: CollectionCardProps) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteCollection = useCollectionStore((state) => state.deleteCollection);
  const updateCollection = useCollectionStore((state) => state.updateCollection);

  const handleClick = () => {
    navigate(`/collection/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteCollection(id);
    setIsDeleteModalOpen(false);
  };

  const handleEditConfirm = async (newName: string) => {
    await updateCollection(id, newName);
    setIsEditModalOpen(false);
  };

  // 바깥 영역 클릭 시 모달 닫기 처리
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 현재 이벤트가 발생한 요소가 바깥 영역(overlay)인 경우에만 닫기
    if (e.currentTarget === e.target) {
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
    }
  };

  return (
    <>
      <div
        className="w-full p-5 border border-normal rounded-xl bg-white relative cursor-pointer hover:bg-lighthover shadow-md group"
        onClick={handleClick}
      >
        <h3 className="text-24 font-pre-bold mb-5 text-normalactive pt-4 line-clamp-1 group-hover:line-clamp-none break-words">
          {name}
        </h3>

        {/* 수정/삭제 아이콘 - id가 0이 아닐 때만 표시 */}
        {id !== 0 && (
          <div className="absolute top-5 right-5 flex gap-3">
            <img
              src={editIcon}
              alt="수정"
              className="w-3 h-3 cursor-pointer"
              onClick={handleEditClick}
            />
            <img
              src={trashIcon}
              alt="삭제"
              className="w-3 h-3 cursor-pointer"
              onClick={handleDeleteClick}
            />
          </div>
        )}

        {/* 메모지/퀴즈 통계 */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <img src={memozyIcon} alt="메모지" className="w-5 h-5" />
            <span className="text-16 font-pre-semibold">Memozy</span>
            <span className="text-16 font-pre-semibold text-normal">{memozyCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-16 font-pre-semibold">퀴즈</span>
            <span className="text-16 font-pre-semibold text-normal">{quizCount}</span>
          </div>
        </div>
      </div>

      {/* id가 0이 아닐 때만 모달 표시 */}
      {id !== 0 && (
        <>
          {isDeleteModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={handleOutsideClick}
            >
              <DeleteCollection
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                collectionName={name}
                onDelete={handleDeleteConfirm}
              />
            </div>
          )}
          {isEditModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={handleOutsideClick}
            >
              <EditCollectionName
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                collectionName={name}
                onEdit={handleEditConfirm}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default CollectionCard;
