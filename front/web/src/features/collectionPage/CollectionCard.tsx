import memozyIcon from '../../assets/icons/memozyIcon.png';
import editIcon from '../../assets/icons/editIcon.png';
import trashIcon from '../../assets/icons/trashIcon.png';
import { Collection } from '../../types/collection';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteCollection from './CollectionPageModal/DeleteCollection';
import EditCollectionName from './CollectionPageModal/EditCollectionName';

interface CollectionCardProps {
    collection: Collection;
}

function CollectionCard({ collection }: CollectionCardProps) {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleClick = () => {
        navigate(`/collection/${collection.id}`);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };
    

    const handleDeleteConfirm = () => {
        // TODO: 삭제 API 호출
        console.log('컬렉션 삭제:', collection.id);
        setIsDeleteModalOpen(false);
    };

    const handleEditConfirm = () => {
        // TODO: 수정 API 호출
        console.log('컬렉션 수정:', collection.id);
        setIsEditModalOpen(false);
    };


    return (
        <>
            <div 
                className="w-full p-5 border border-normal rounded-xl bg-light relative cursor-pointer hover:bg-lighthover"
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

            <DeleteCollection
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                collectionName={collection.name}
                onDelete={handleDeleteConfirm}
            />
            <EditCollectionName
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                collectionName={collection.name}
                onEdit={handleEditConfirm}
            />
        </>
    );
}

export default CollectionCard;
