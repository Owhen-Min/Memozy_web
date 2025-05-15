import closeIcon from "../../assets/icons/closeIcon.svg";
import { useCollectionStore } from "../../stores/collection/collectionStore";
import { useParams } from "react-router";
interface DeleteMemozyModalProps {
  quizId: number[] | null;
  sourceId: number[] | null;
  onClose: () => void;
}

function DeleteMemozyModal({ quizId, sourceId, onClose }: DeleteMemozyModalProps) {
  const { deleteQuiz, fetchMemozyList } = useCollectionStore();
  const { collectionId } = useParams();

  const handleDelete = async () => {
    try {
      await deleteQuiz(quizId || [], sourceId || []);
      if (collectionId) {
        await fetchMemozyList(Number(collectionId));
      }
      onClose();
    } catch (err) {
      console.error("메모지 삭제 중 오류 발생:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
      <button onClick={onClose} className="absolute top-4 right-4">
        <img src={closeIcon} alt="close" className="w-3 h-3" />
      </button>
      <h1 className="text-20 font-pre-bold text-center mb-4">
        <span className="font-pre-bold">Memozy 삭제하기</span>
      </h1>
      <p className="text-16 font-pre-medium text-center mb-8">
        해당 Memozy 와 퀴즈들을 삭제하시겠습니까
      </p>
      <button
        onClick={handleDelete}
        className="w-full bg-red text-white rounded-xl py-2 font-pre-medium text-16 hover:bg-red/90 transition-colors"
      >
        삭제
      </button>
    </div>
  );
}

export default DeleteMemozyModal;
