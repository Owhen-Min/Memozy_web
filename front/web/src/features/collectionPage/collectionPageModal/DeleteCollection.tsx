interface DeleteCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  onDelete: () => void;
}

function DeleteCollection({ isOpen, onClose, collectionName, onDelete }: DeleteCollectionProps) {
  if (!isOpen) return null;

  return (
    <div className="w-[400px] bg-white rounded-xl p-6">
      <h2 className="text-24 font-pre-bold mb-4">컬렉션 삭제</h2>
      <p className="text-16 mb-6">
        <span className="font-pre-bold">{collectionName}</span> 컬렉션을 삭제하시겠습니까?
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white font-pre-semibold text-normal rounded-lg hover:text-normalhover"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 bg-red font-pre-semibold text-white rounded-lg hover:bg-redhover"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default DeleteCollection;
