import { useState } from "react";
import { validateCollectionName } from "../../../utils/validation";
import { useCollectionStore } from "../../../stores/collection/collectionStore";

interface AddCollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddCollection({ isOpen, onClose }: AddCollectionProps) {
  const [collectionName, setCollectionName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const createCollection = useCollectionStore((state) => state.createCollection);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCollectionName(collectionName);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    // 컬렉션 생성 로직(store 함수 호출)
    try {
      await createCollection(collectionName);
      setCollectionName("");
      setErrorMessage("");
      onClose();
    } catch (err) {
      setErrorMessage("컬렉션 생성 중 오류가 발생했습니다.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCollectionName(newName);

    // 20자 이상이면 먼저 에러 메시지 표시
    if (newName.length >= 20) {
      setErrorMessage("컬렉션 이름은 최대 20자까지 입력 가능합니다.");
      return;
    }

    const validation = validateCollectionName(newName);
    setErrorMessage(validation.message);
  };

  return (
    <div className="w-[400px] bg-white rounded-xl p-6">
      <h2 className="text-24 font-pre-bold mb-4">새 컬렉션 만들기</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={collectionName}
            onChange={handleNameChange}
            placeholder="컬렉션 이름을 입력하세요"
            maxLength={20}
            className={`w-full p-3 border ${errorMessage ? "border-red" : "border-gray300"} rounded-lg`}
          />
          {errorMessage && <p className="mt-1 text-12 text-red">{errorMessage}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white font-pre-semibold text-red rounded-lg hover:text-redhover"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-normal font-pre-semibold text-white rounded-lg hover:bg-normalhover"
          >
            생성
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCollection;
