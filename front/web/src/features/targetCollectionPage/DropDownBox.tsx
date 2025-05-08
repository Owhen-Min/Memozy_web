// TODO 퀴즈 목록 드롭다운 박스에 편집 모드 추가 
import { useState, useEffect } from 'react';
import { Quiz } from '../../types/quiz';
import { quizData } from '../../dummy/quizData';
import trashIcon from '../../assets/icons/trashIcon.png';
import DeleteQuizModal from './DeleteQuizModal';

interface DropDownBoxProps {
    memozyId: number;
}

function DropDownBox({ memozyId }: DropDownBoxProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState<number | null>(null);

    useEffect(() => {
        // 실제 API 연동 시 아래 주석을 해제하고 더미 데이터 부분을 제거
        /*
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`/collection/url/${memozyId}/quiz`);
                const data = await response.json();
                setQuizzes(data.data);
            } catch (error) {
                console.error('퀴즈 데이터 로드 실패:', error);
            }
        };
        fetchQuizzes();
        */
        
        // 더미 데이터 사용
        setQuizzes(quizData.data);
    }, [memozyId]);

    return (
        <div className="mt-4 bg-white rounded-b-xl shadow-lg overflow-hidden border border-light/50">
            <div className="max-h-[300px] overflow-y-auto">
                {quizzes.map((quiz) => (
                    <div 
                        key={quiz.quizId} 
                        className="p-4 hover:bg-light border-b border-light last:border-0"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[14px] font-pre-medium text-main200 flex-1 break-words">
                                {quiz.quizContent}
                            </span>
                            <span className="text-[12px] font-pre-regular text-gray200 whitespace-nowrap">
                                {quiz.quizType === "MULTIPLE_CHOICE" ? "객관식" : quiz.quizType === "OBJECTIVE" ? "주관식" : "O/X"}
                            </span>
                            <span 
                                className="flex items-center hover:cursor-pointer"
                                onClick={() => {
                                    setDeleteQuizId(quiz.quizId);
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                <img src={trashIcon} alt="trash" className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {isDeleteModalOpen && (
                <DeleteQuizModal
                    quizId={[deleteQuizId!]}
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
