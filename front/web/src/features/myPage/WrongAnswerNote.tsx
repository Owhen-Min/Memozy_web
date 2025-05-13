import { useState, useEffect } from "react";
import { quizHistoryData } from "../../dummy/quizHistoryData";
import small_logo from "../../assets/images/small_logo.png";
import folder from "../../assets/images/folder.png";
import Modal from "./WrongAnswerModal";
import { QuizHistoryData, WrongAnswer } from "../../types/wrongAnswer";
import { fetchWrongAnswerCollections } from "../../apis/history/historyApi";

function WrongAnswerNote() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 모달에 전달할 데이터를 관리하는 state
  const [modalData, setModalData] = useState<QuizHistoryData | null>(null);
  const [collectionList, setCollectionList] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleFolderClick = (id: number) => {
    // 클릭한 아이템의 id를 사용하여 quizHistoryData에서 해당 데이터를 찾기
    const data = quizHistoryData.find((item) => item.id === id);
    if (data) {
      // 찾은 데이터를 모달에 전달할 데이터로 설정하고 모달을 열기
      setIsModalOpen(true);
    }
  };

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-10">
          <img src={small_logo} alt="로고" className="w-10" />
          <h2 className="text-[28px] font-pre-medium">오답노트</h2>
        </div>
        <div>데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-10">
        <img src={small_logo} alt="로고" className="w-10" />
        <h2 className="text-[28px] font-pre-medium">오답노트</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {collectionList.map((item) => (
          <div
            key={item.id}
            className="relative cursor-pointer transition-transform hover:scale-105 w-[164px] mx-auto"
            onClick={() => handleFolderClick(item.id)}
          >
            <img src={folder} alt="폴더" className="w-full" />
            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-[140px]">
              <h3 className="text-16 font-pre-medium truncate">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={modalData} />
    </div>
  );
}

export default WrongAnswerNote;
