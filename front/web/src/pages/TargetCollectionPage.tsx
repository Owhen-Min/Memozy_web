import { useParams, useLocation } from "react-router-dom";
import { memozyData } from "../dummy/memozyData";
import MemozyCard from "../features/targetCollectionPage/MemozyCard";
import { useState } from 'react';
import CreateQuizShowModal from '../features/targetCollectionPage/CreateQuizShowModal';
import memozyIcon from '../assets/icons/memozyIcon.png';
import DeleteMemozyModal from '../features/targetCollectionPage/DeleteMemozyModal';
import CopyMemozyModal from '../features/targetCollectionPage/CopyMemozyModal';

interface LocationState {
    collectionName: string;
    memozyCount: number;
    quizCount: number;
}

function TargetCollectionPage() {
    const { collectionId } = useParams();
    const location = useLocation();
    const { collectionName, memozyCount, quizCount } = location.state as LocationState;
    const [isQuizShowModalOpen, setIsQuizShowModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedMemozyIds, setSelectedMemozyIds] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    const handleMemozySelect = (memozyId: number) => {
        setSelectedMemozyIds(prev => 
            prev.includes(memozyId) 
                ? prev.filter(id => id !== memozyId)
                : [...prev, memozyId]
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
                            className={`text-16 font-pre-medium ${isEditMode ? 'text-white bg-normal' : 'text-normal bg-white'} rounded-xl px-4 py-1 border border-normal`}
                        >
                            {isEditMode ? 'Memozy 편집 완료' : 'Memozy 편집'}
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
                {memozyData.data.content.map((content) => (
                    <MemozyCard 
                        key={content.urlId}
                        memozyId={content.urlId}
                        urlTitle={content.urlTitle}
                        summary={content.summary}
                        quizCount={content.quizCount}
                        isEditMode={isEditMode}
                        isSelected={selectedMemozyIds.includes(content.urlId)}
                        onSelect={() => handleMemozySelect(content.urlId)}
                    />
                ))}
            </div>

            {isQuizShowModalOpen && (
                <CreateQuizShowModal 
                    onClose={() => setIsQuizShowModalOpen(false)} 
                    collectionId={collectionId}
                    quizCount={quizCount}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteMemozyModal
                    memozyIds={selectedMemozyIds}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}

            {isCopyModalOpen && (
                <CopyMemozyModal
                    memozyIds={selectedMemozyIds}
                    onClose={() => setIsCopyModalOpen(false)}
                />
            )}
        </>
    );
}

export default TargetCollectionPage;
