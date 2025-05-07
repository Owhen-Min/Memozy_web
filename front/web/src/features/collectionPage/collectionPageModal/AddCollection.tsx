import { useState } from 'react';
import { validateCollectionName } from '../../../utils/validation';

interface AddCollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddCollection({ isOpen, onClose }: AddCollectionProps) {
  const [collectionName, setCollectionName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateCollectionName(collectionName);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    // 차후 컬렉션 생성 로직 추가
    console.log('새 컬렉션 생성:', collectionName);
    setCollectionName('');
    setErrorMessage('');
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCollectionName(newName);
    
    const validation = validateCollectionName(newName);
    setErrorMessage(validation.message);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[400px] bg-white rounded-xl p-6">
        <h2 className="text-24 font-pre-bold mb-4">새 컬렉션 만들기</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={collectionName}
              onChange={handleNameChange}
              placeholder="컬렉션 이름을 입력하세요"
              className={`w-full p-3 border ${errorMessage ? 'border-red' : 'border-gray300'} rounded-lg`}
            />
            {errorMessage && (
              <p className="mt-1 text-12 text-red">{errorMessage}</p>
            )}
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
    </div>
  );
}

export default AddCollection;
