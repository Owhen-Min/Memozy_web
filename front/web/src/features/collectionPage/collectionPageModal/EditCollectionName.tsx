import { useState } from "react";
import { validateCollectionName } from "../../../utils/validation";

interface EditCollectionNameProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  onEdit: (newName: string) => void;
}

function EditCollectionName({ isOpen, onClose, collectionName, onEdit }: EditCollectionNameProps) {
  const [newName, setNewName] = useState(collectionName);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const validation = validateCollectionName(newName);
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    onEdit(newName);
    setErrorMessage("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewName(value);

    const validation = validateCollectionName(value);
    setErrorMessage(validation.message);
  };

  return (
    <div className="w-[400px] bg-white rounded-xl p-6">
      <h2 className="text-24 font-pre-bold mb-4">컬렉션 이름 수정</h2>
      <div className="mb-6">
        <label htmlFor="collectionName" className="block text-16 font-pre-medium mb-2">
          새로운 컬렉션 이름
        </label>
        <input
          type="text"
          id="collectionName"
          value={newName}
          onChange={handleNameChange}
          className={`w-full px-4 py-2 border ${errorMessage ? "border-red" : "border-normal"} rounded-lg focus:outline-none focus:border-primary`}
          placeholder="컬렉션 이름을 입력하세요"
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
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-normal font-pre-semibold text-white rounded-lg hover:bg-normalhover"
        >
          수정
        </button>
      </div>
    </div>
  );
}

export default EditCollectionName;
