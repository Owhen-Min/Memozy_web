import { useState, useEffect } from 'react';
import { Quiz } from '../../types/quiz';
import { quizData } from '../../dummy/quizData';

interface DropDownBoxProps {
    memozyId: number;
}

function DropDownBox({ memozyId }: DropDownBoxProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

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
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-[14px] font-pre-medium text-main200 flex-1 break-words">
                                {quiz.quizContent}
                            </span>
                            <span className="text-[12px] font-pre-regular text-gray200 whitespace-nowrap mt-1">
                                {quiz.quizType === "MULTIPLE_CHOICE" ? "객관식" : quiz.quizType === "OBJECTIVE" ? "주관식" : "O/X"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DropDownBox;
