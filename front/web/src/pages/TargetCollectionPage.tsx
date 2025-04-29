import { useParams } from "react-router-dom";


function TargetCollectionPage() {
    const { collectionId } = useParams();
    const targetCollectionName = collectionId === 'all' 
        ? '모두 보기' 
        : collectionId ? collectionId : '';

    return (
        <div className="content">
            <h1 className="text-32 font-pre-bold mb-8 text-normalactive">
                {targetCollectionName}
                <span className="text-20 font-pre-medium text-main100 pl-2">컬렉션</span>
            </h1>

        </div>
    );
}

export default TargetCollectionPage;
