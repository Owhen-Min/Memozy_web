import closeIcon from "../../assets/icons/closeIcon.svg";
import { useCollectionStore } from "../../stores/collection/collectionStore";
import { useParams } from "react-router";

interface DeleteQuizModalProps {
  quizId: number[];
  sourceId: number[];
  onClose: () => void;
}

function DeleteQuizModal({ quizId, sourceId, onClose }: DeleteQuizModalProps) {
  const { deleteQuiz, fetchMemozyList } = useCollectionStore();
  const { collectionId } = useParams();

  const handleDelete = async () => {
    try {
      await deleteQuiz(quizId, sourceId);
      if (collectionId) {
        await fetchMemozyList(Number(collectionId));
      }
      onClose();
    } catch (error) {
      console.error("퀴즈 삭제 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img src={closeIcon} alt="close" className="w-3 h-3" />
        </button>
        <h1 className="text-[20px] font-pre-bold text-center mb-4">
          <span className="font-pre-bold">퀴즈 삭제하기</span>
        </h1>
        <p className="text-[16px] font-pre-medium text-center mb-8">
          해당 퀴즈를 삭제하시겠습니까?
        </p>
        <button
          onClick={handleDelete}
          className="w-full bg-red text-white rounded-xl py-2 font-pre-medium text-[16px] hover:bg-redhover transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default DeleteQuizModal;
