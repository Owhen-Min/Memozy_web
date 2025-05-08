import memozyIcon from '../../assets/icons/memozyIcon.png';
import editIcon from '../../assets/icons/editIcon.png';
import trashIcon from '../../assets/icons/trashIcon.png';
// import { Collection } from '../../types/collection';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteCollection from './collectionPageModal/DeleteCollection';
import EditCollectionName from './collectionPageModal/EditCollectionName';

interface CollectionCardProps {
    id: number;
    name: string;
    memozyCount: number;
    quizCount: number;
}

function CollectionCard({ id, name, memozyCount, quizCount }: CollectionCardProps) {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleClick = () => {
        navigate(`/collection/${id}`, {
            state: {
                collectionName: name,
                memozyCount,
                quizCount
            }
        });
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
        console.log('컬렉션 삭제:', id);
        setIsDeleteModalOpen(false);
    };

    const handleEditConfirm = () => {
        // TODO: 수정 API 호출
        console.log('컬렉션 수정:', id);
        setIsEditModalOpen(false);
    };


    return (
        <>
            <div 
                className="w-full p-5 border border-normal rounded-xl bg-white relative cursor-pointer hover:bg-lighthover shadow-md"
                onClick={handleClick}
            >
                <h3 className="text-24 font-pre-bold mb-5 text-normalactive">{name}</h3>
                
                {/* 수정/삭제 아이콘 */}
                <div className="absolute top-5 right-5 flex gap-3">
                    <img 
                        src={editIcon} 
                        alt="수정" 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={handleEditClick}
                    />
                    <img 
                        src={trashIcon} 
                        alt="삭제" 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={handleDeleteClick}
                    />
                </div>

                {/* 메모지/퀴즈 통계 */}
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <img src={memozyIcon} alt="메모지" className="w-5 h-5" />
                        <span className="text-16 font-pre-semibold">Memozy</span>
                        <span className="text-16 font-pre-semibold text-normal">{memozyCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-16 font-pre-semibold">퀴즈</span>
                        <span className="text-16 font-pre-semibold text-normal">{quizCount}</span>
                    </div>
                </div>
            </div>

            <DeleteCollection
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                collectionName={name}
                onDelete={handleDeleteConfirm}
            />
            <EditCollectionName
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                collectionName={name}
                onEdit={handleEditConfirm}
            />
        </>
    );
}

export default CollectionCard;
