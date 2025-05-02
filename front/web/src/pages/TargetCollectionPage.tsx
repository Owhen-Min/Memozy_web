// import { useParams } from "react-router-dom";
import { memozyData } from "../dummy/memozyData";
import MemozyCard from "../features/targetCollectionPage/MemozyCard";


function TargetCollectionPage() {
    // const { collectionId } = useParams();
    const targetCollectionName = memozyData.data.collectionName 

    return (
        <div className="content">
            <h1 className="text-32 font-pre-bold text-normalactive">
                {targetCollectionName}
                <span className="text-20 font-pre-medium text-main200 pl-2">컬렉션</span>
            </h1>
            <div className="flex gap-2 mb-8 justify-end">
                <button className="text-16 font-pre-medium text-white bg-normal rounded-xl px-4 py-1">
                    퀴즈쇼 생성
                </button>
                <button className="text-16 font-pre-medium text-normal bg-white rounded-xl px-4 py-1 border border-normal">
                    Memozy 편집
                </button>
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
    );
}

export default TargetCollectionPage;
