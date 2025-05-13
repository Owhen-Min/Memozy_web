import { useState, useEffect } from "react";
import small_logo from "../../assets/images/small_logo.png";
import folder from "../../assets/images/folder.png";
import Modal from "./WrongAnswerModal";
import { QuizHistoryData, WrongAnswer } from "../../types/wrongAnswer";
import { fetchWrongAnswerCollections, fetchWrongAnswerDetail } from "../../apis/history/historyApi";

function WrongAnswerNote() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<QuizHistoryData | null>(null);
  const [collectionList, setCollectionList] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    // API를 사용하여 오답노트 컬렉션 리스트 가져오기
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWrongAnswerCollections();
        setCollectionList(data);
      } catch (error) {
        console.error("오답노트 컬렉션을 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleFolderClick = async (id: number) => {
    try {
      setIsDetailLoading(true);
      // 선택한 컬렉션의 이름 가져오기
      const collection = collectionList.find((item) => item.id === id);
      if (!collection) return;

      // 해당 컬렉션의 오답 내역 가져오기
      const historyData = await fetchWrongAnswerDetail(id);

      // 모달에 표시할 데이터 설정
      setModalData({
        id: id,
        name: collection.name,
        data: historyData,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("오답 내역을 가져오는 중 오류 발생:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-10">
          <img src={small_logo} alt="로고" className="w-8 md:w-10" />
          <h2 className="text-24 md:text-[28px] font-pre-medium">오답노트</h2>
        </div>
        <div>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-10">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">오답노트</h2>
      </div>

      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-start sm:gap-16 sm:px-6">
          {collectionList.map((item) => (
            <div
              key={item.id}
              className="relative cursor-pointer transition-transform hover:scale-105 w-full sm:w-[164px] p-2 sm:p-0"
              onClick={() => handleFolderClick(item.id)}
            >
              <img src={folder} alt="폴더" className="w-full" />
              <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[90%] sm:w-[140px]">
                <h3 className="text-16 font-pre-medium truncate">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        isLoading={isDetailLoading}
      />
    </div>
  );
}

export default WrongAnswerNote;
