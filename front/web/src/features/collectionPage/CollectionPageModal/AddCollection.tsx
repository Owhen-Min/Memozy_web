import { useState } from 'react';

interface AddCollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddCollection({ isOpen, onClose }: AddCollectionProps) {
  const [collectionName, setCollectionName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 차후 컬렉션 생성 로직 추가
    console.log('새 컬렉션 생성:', collectionName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[400px] bg-white rounded-xl p-6">
        <h2 className="text-24 font-pre-bold mb-4">새 컬렉션 만들기</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="컬렉션 이름을 입력하세요"
            className="w-full p-3 border border-gray300 rounded-lg mb-4"
          />
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
    </div>
  );
}

export default AddCollection;
