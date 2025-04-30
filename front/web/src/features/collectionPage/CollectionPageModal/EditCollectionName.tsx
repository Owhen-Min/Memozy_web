import { useState } from 'react';

interface EditCollectionNameProps {
    isOpen: boolean;
    onClose: () => void;
    collectionName: string;
    onEdit: (newName: string) => void;
}

function EditCollectionName({ isOpen, onClose, collectionName, onEdit }: EditCollectionNameProps) {
    const [newName, setNewName] = useState(collectionName);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (newName.trim() === '') {
            alert('컬렉션 이름을 입력해주세요.');
            return;
        }
        onEdit(newName);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 border border-normal rounded-lg focus:outline-none focus:border-primary"
                        placeholder="컬렉션 이름을 입력하세요"
                    />
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
        </div>
    );
}

export default EditCollectionName;
