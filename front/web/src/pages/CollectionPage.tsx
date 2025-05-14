import { useEffect } from "react";
import CollectionCard from "../features/collectionPage/CollectionCard";
import collectionPlusIcon from "../assets/icons/collectionPlusIcon.png";
import memozyIcon from "../assets/icons/memozyIcon.png";
import { useNavigate } from "react-router";
import AddCollection from "../features/collectionPage/collectionPageModal/AddCollection";
import { useState } from "react";
import small_logo from "../assets/images/small_logo.png";
import { motion } from "framer-motion";
import { useCollectionStore } from "../stores/collection/collectionStore";

function CollectionPage() {
  const navigate = useNavigate();
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false);

  // store에서 데이터와 함수 가져오기
  const { collections, loading, error, fetchCollections, fetchAllCollection, allCollection } =
    useCollectionStore();

  // 컴포넌트 마운트 시 컬렉션 데이터 가져오기
  useEffect(() => {
    fetchCollections();
    fetchAllCollection();
  }, [fetchCollections, fetchAllCollection]);

  const handleAddCollectionClick = () => {
    setIsAddCollectionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddCollectionModalOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // 로딩 중이거나 에러가 있을 때 처리
  if (loading) return <div className="content">로딩 중...</div>;
  if (error) return <div className="content">에러: {error}</div>;

  return (
    <div className="content">
      <h1 className="text-[28px] font-pre-semibold mb-8 text-main200 flex items-center gap-2">
        <img src={small_logo} alt="logo" className="w-10 h-10" />
        컬렉션 리스트
      </h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div>
          <CollectionCard
            id={allCollection?.id ?? 0}
            name={allCollection?.name ?? ""}
            memozyCount={allCollection?.memozyCount ?? 0}
            quizCount={allCollection?.quizCount ?? 0}
          />
        </motion.div>

        {(collections || []).map((collection) => (
          <motion.div key={collection.id} variants={item}>
            <CollectionCard
              id={collection.id}
              name={collection.name}
              memozyCount={collection.memozyCount}
              quizCount={collection.quizCount}
            />
          </motion.div>
        ))}

        {/* 새 컬렉션 추가 카드 */}
        <motion.div
          variants={item}
          className="w-full p-5 border border-gray300 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:bg-[#ECECEC] shadow-md"
          onClick={handleAddCollectionClick}
        >
          <img src={collectionPlusIcon} alt="새 컬렉션 추가" className="w-12 h-12" />
        </motion.div>
      </motion.div>

      <AddCollection isOpen={isAddCollectionModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
//ejt
export default CollectionPage;
