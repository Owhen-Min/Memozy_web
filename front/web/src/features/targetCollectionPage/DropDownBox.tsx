// TODO 퀴즈 목록 드롭다운 박스에 편집 모드 추가
import { useState, useEffect } from "react";
import trashIcon from "../../assets/icons/trashIcon.png";
import DeleteQuizModal from "./DeleteQuizModal";
import { useCollectionStore } from "../../stores/collection/collectionStore";

interface DropDownBoxProps {
  sourceId: number;
  collectionId?: string;
}

function DropDownBox({ sourceId, collectionId }: DropDownBoxProps) {
  const { quizzes, fetchQuizList, loading } = useCollectionStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteQuizId, setDeleteQuizId] = useState<number | null>(null);
  const currentQuizzes = quizzes.get(sourceId) || [];

  useEffect(() => {
    fetchQuizList(sourceId);
  }, [sourceId, fetchQuizList]);

  return (
    <div className="mt-4 bg-white rounded-b-xl shadow-lg overflow-hidden border border-light/50">
      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray200">로딩 중...</div>
        ) : currentQuizzes.length === 0 ? (
          <div className="p-4 text-center text-gray200">퀴즈가 없습니다.</div>
        ) : (
          currentQuizzes.map((quiz) => (
            <div
              key={quiz.quizId}
              className="p-4 hover:bg-light border-b border-light last:border-0"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-14 font-pre-medium text-main200 flex-1 break-words">
                  {quiz.quizContent}
                </span>
                <span className="text-12 font-pre-regular text-gray200 whitespace-nowrap">
                  {quiz.quizType === "MULTIPLE_CHOICE"
                    ? "객관식"
                    : quiz.quizType === "OBJECTIVE"
                      ? "주관식"
                      : "O/X"}
                </span>
                <div className="flex gap-2">
                  {collectionId !== "0" && (
                    <span
                      className="flex items-center hover:cursor-pointer"
                      onClick={() => {
                        setDeleteQuizId(quiz.quizId);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <img src={trashIcon} alt="trash" className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isDeleteModalOpen && (
        <DeleteQuizModal
          quizId={[deleteQuizId!]}
          sourceId={[sourceId]}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteQuizId(null);
          }}
        />
      )}
    </div>
  );
}

export default DropDownBox;
