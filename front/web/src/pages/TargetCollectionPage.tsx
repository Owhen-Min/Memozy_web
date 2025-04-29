import { useParams } from "react-router-dom";


function TargetCollectionPage() {
    const { targetCollectionId } = useParams();
    const targetCollectionName = targetCollectionId === 'all' 
        ? '모두 보기' 
        : targetCollectionId ? targetCollectionId.replace(/-/g, ' ') : '';

    return (
        <div className="content">
            <h1 className="text-32 font-pre-bold mb-8 text-normalactive">{targetCollectionName}</h1>
        </div>
    );
}

export default TargetCollectionPage;
