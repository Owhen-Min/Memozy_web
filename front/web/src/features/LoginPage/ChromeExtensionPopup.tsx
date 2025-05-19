import React, { useState } from "react";

interface ChromeExtensionPopupProps {
  onClose: () => void;
  onDontShowAgain: () => void;
}

const ChromeExtensionPopup: React.FC<ChromeExtensionPopupProps> = ({
  onClose,
  onDontShowAgain,
}) => {
  const [dontShow, setDontShow] = useState(false);

  const handleClose = () => {
    if (dontShow) {
      onDontShowAgain();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 items-center justify-center z-50 hidden md:flex">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
        <h2 className="text-lg font-pre-semibold mb-2 text-center">
          Memozy 크롬 익스텐션 설치 안내
        </h2>
        <p className="mb-4 text-14 text-gray-700 font-pre-regular">
          웹에서 원하는 정보를 드래그하여 한 번에 저장하면, AI가 요약하고, 퀴즈로 만들어 학습을
          도와줍니다.
          <br />
          <span className="text-[#4285F4] font-pre-semibold">Memozy 확장 프로그램</span>
          <span className="font-pre-regular">으로 더 스마트하게 기억하세요.</span>
        </p>
        <a
          href="https://chromewebstore.google.com/detail/memozy/edkigpibifokljeefiomnfadenbfcchj"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-500 text-white py-2 rounded mb-2 font-pre-medium"
        >
          크롬 익스텐션 설치하기
        </a>
        <div className="flex items-center justify-between">
          <label
            htmlFor="dontShowAgain"
            className="flex items-center text-12 text-gray-600 cursor-pointer font-pre-regular"
          >
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShow}
              onChange={() => setDontShow((prev) => !prev)}
              className="mr-2"
            />
            다시 보지 않기
          </label>
          <button
            onClick={handleClose}
            className="ml-2 px-3 py-1 text-12 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-pre-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChromeExtensionPopup;
