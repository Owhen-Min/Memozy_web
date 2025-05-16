import { useState, useEffect } from "react";
import small_logo from "../../assets/images/small_logo.png";
import folder from "../../assets/images/folder.png";
import Modal from "./WrongAnswerModal";
import { QuizHistoryData, WrongAnswer } from "../../types/wrongAnswer";
import {
  fetchWrongAnswerCollections,
  fetchWrongAnswerDetail,
  fetchAllWrongAnswers,
} from "../../apis/history/historyApi";

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

        // 모두보기 컬렉션의 오답 내역 확인
        const allWrongAnswers = await fetchAllWrongAnswers();

        // 오답이 있는 경우에만 모두보기 컬렉션 추가
        if (allWrongAnswers.length > 0) {
          setCollectionList([{ id: -1, name: "모두보기" }, ...data]);
        } else {
          setCollectionList(data);
        }
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

      let historyData;
      // 모두보기 컬렉션인 경우
      if (id === -1) {
        historyData = await fetchAllWrongAnswers();
      } else {
        // 일반 컬렉션인 경우
        historyData = await fetchWrongAnswerDetail(id);
      }

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
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-10">
        <img src={small_logo} alt="로고" className="w-8 md:w-10" />
        <h2 className="text-24 md:text-[28px] font-pre-semibold">오답노트</h2>
      </div>

      <div className="max-w-full mx-auto">
        {collectionList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p className="text-14 md:text-16 font-pre-medium">오답노트가 존재하지 않습니다.</p>
            <p className="mt-2 text-12 md:text-14">퀴즈를 풀고 오답노트를 생성해보세요!</p>
          </div>
        ) : (
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
        )}
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
