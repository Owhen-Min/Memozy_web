import memozyIcon from '../../assets/icons/memozyIcon.png';
import editIcon from '../../assets/icons/editIcon.png';
import trashIcon from '../../assets/icons/trashIcon.png';
import { Collection } from '../../types/collection';
import { useNavigate } from 'react-router-dom';

interface CollectionCardProps {
    collection: Collection;
}

function CollectionCard({ collection }: CollectionCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/target-collection/${collection.name.replace(/\s+/g, '-')}`);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 수정 로직 추가
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 삭제 로직 추가
    };

    return (
        <div 
            className="w-full p-5 border border-normal rounded-xl bg-light relative cursor-pointer hover:border-normalhover"
            onClick={handleClick}
        >
            <h3 className="text-24 font-pre-bold mb-5">{collection.name}</h3>
            
            {/* 수정/삭제 아이콘 */}
            <div className="absolute top-5 right-5 flex gap-2.5">
                <img 
                    src={editIcon} 
                    alt="수정" 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={handleEditClick}
                />
                <img 
                    src={trashIcon} 
                    alt="삭제" 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={handleDeleteClick}
                />
            </div>

            {/* 메모지/퀴즈 통계 */}
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <img src={memozyIcon} alt="메모지" className="w-6 h-6" />
                    <span className="text-20 font-pre-medium">Memozy</span>
                    <span className="text-12 font-pre-medium">{collection.memozyCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-20 font-pre-medium">퀴즈 수</span>
                    <span className="text-12 font-pre-medium">{collection.quizCount}</span>
                </div>
            </div>
        </div>
    );
}

export default CollectionCard;
