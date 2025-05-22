import closeIcon from "../../assets/icons/closeIcon.svg";
import { useCollectionStore } from "../../stores/collection/collectionStore";
import { useParams } from "react-router";

interface DeleteQuizModalProps {
  quizId: number[] | null;
  sourceId: number[] | null;
  onClose: () => void;
}

function DeleteQuizModal({ quizId, sourceId, onClose }: DeleteQuizModalProps) {
  const { deleteQuiz, fetchMemozyList, fetchQuizList } = useCollectionStore();
  const { collectionId } = useParams();

  const handleDelete = async () => {
    try {
      if (!quizId || !sourceId) return;

      await deleteQuiz(quizId, sourceId);

      // 삭제된 퀴즈의 sourceId에 대해 퀴즈 목록 새로고침
      await Promise.all(sourceId.map((id) => fetchQuizList(id)));

      // 컬렉션 목록 새로고침
      if (collectionId) {
        await fetchMemozyList(Number(collectionId));
      }

      onClose();
    } catch (error) {
      console.error("퀴즈 삭제 실패:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 max-w-[350px] w-full mx-4 relative flex flex-col items-center">
      <button onClick={onClose} className="absolute top-4 right-4">
        <img src={closeIcon} alt="close" className="w-3 h-3" />
      </button>
      <h1 className="text-20 font-pre-bold text-center mb-4">
        <span className="font-pre-bold">퀴즈 삭제하기</span>
      </h1>
      <p className="text-16 font-pre-medium text-center mb-8">해당 퀴즈를 삭제하시겠습니까?</p>
      <button
        onClick={handleDelete}
        className="w-full bg-red text-white rounded-xl py-2 font-pre-medium text-16 hover:bg-redhover transition-colors"
      >
        삭제
      </button>
    </div>
  );
}

export default DeleteQuizModal;
