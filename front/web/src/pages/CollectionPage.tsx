import { collectionData } from '../dummy/collectionData';
import CollectionCard from '../features/collectionPage/CollectionCard';
import collectionPlusIcon from '../assets/icons/collectionPlusIcon.png';
import memozyIcon from '../assets/icons/memozyIcon.png';
import { useNavigate } from 'react-router-dom';
import AddCollection from '../features/collectionPage/collectionPageModal/AddCollection';
import { useState } from 'react';

function CollectionPage() {
  const navigate = useNavigate();
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);
  
  // 모든 컬렉션의 memozyCount와 quizCount 총합 계산
  const totalMemozyCount = collectionData.data.reduce((sum, item) => sum + item.memozyCount, 0);
  const totalQuizCount = collectionData.data.reduce((sum, item) => sum + item.quizCount, 0);

  const handleAllCollectionsClick = () => {
    navigate('/collection/all');
  };

  const handleAddCollectionClick = () => {
    setIsAddCollectionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddCollectionModalOpen(false);
  };

  return (
    <div className="content">
      <h1 className="text-32 font-pre-bold mb-8 text-normalactive">컬렉션 리스트</h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 컬렉션 모두보기 */}
        <div 
          className="w-full p-5 border border-normal rounded-xl bg-light relative cursor-pointer hover:bg-lighthover"
          onClick={handleAllCollectionsClick}
        >
          <h3 className="text-24 font-pre-semibold mb-5">모두 보기</h3>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <img src={memozyIcon} alt="메모지" className="w-6 h-6" />
              <span className="text-20 font-pre-medium">Memozy</span>
              <span className="text-12 font-pre-medium">{totalMemozyCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-20 font-pre-medium">퀴즈 수</span>
              <span className="text-12 font-pre-medium">{totalQuizCount}</span>
            </div>
          </div>
        </div>

        {collectionData.data.map(({id, name, memozyCount, quizCount}) => (
          <CollectionCard 
            key={id} 
            id={id}
            name={name}
            memozyCount={memozyCount}
            quizCount={quizCount}
          />
        ))}

        {/* 새 컬렉션 추가 카드 */}
        <div className="w-full p-5 border border-gray300 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:bg-[#ECECEC]"
          onClick={handleAddCollectionClick}
        >
          <img src={collectionPlusIcon} alt="새 컬렉션 추가" className="w-12 h-12" />
        </div>
      </div>

      <AddCollection 
        isOpen={isAddCollectionModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default CollectionPage;
