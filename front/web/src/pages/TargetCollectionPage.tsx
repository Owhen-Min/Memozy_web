import { useParams, useLocation } from "react-router-dom";
import { memozyData } from "../dummy/memozyData";
import MemozyCard from "../features/targetCollectionPage/MemozyCard";
import { useState } from 'react';
import CreateQuizShowModal from '../features/targetCollectionPage/CreateQuizShowModal';
import memozyIcon from '../assets/icons/memozyIcon.png';

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
                        <span className="text-16 font-pre-medium">Memozy</span>
                        <span className="text-16 font-pre-medium">{memozyCount}</span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsQuizShowModalOpen(true)}
                            className="text-16 font-pre-medium text-white bg-normal rounded-xl px-4 py-1"
                        >
                            퀴즈쇼 생성
                        </button>
                        <button className="text-16 font-pre-medium text-normal bg-white rounded-xl px-4 py-1 border border-normal">
                            Memozy 편집
                        </button>
                    </div>
                </div>
                {memozyData.data.content.map((content) => (
                    <MemozyCard 
                        key={content.urlId}
                        memozyId={content.urlId}
                        urlTitle={content.urlTitle}
                        summary={content.summary}
                        quizCount={content.quizCount}
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
        </>
    );
}

export default TargetCollectionPage;
