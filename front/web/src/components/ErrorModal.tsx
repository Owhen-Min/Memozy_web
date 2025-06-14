import { useErrorStore } from "../stores/errorStore";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import closeIcon from "../assets/icons/closeIcon.svg";

function ErrorModal() {
  const { error, isModalOpen, clearError, showButtons } = useErrorStore();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
    }
  }, [isModalOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearError();
    }, 300);
  };

  const handleBackClick = () => {
    navigate(-1);
    handleClose();
  };

  const handleHomeClick = () => {
    navigate("/");
    handleClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showButtons && e.target === e.currentTarget) {
      handleClose();
    }
  };

  return isModalOpen ? (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ease-in-out duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full mx-4 relative">
        {!showButtons && (
          <button onClick={clearError} className="absolute top-4 right-4">
            <img src={closeIcon} alt="close" className="w-3 h-3" />
          </button>
        )}

        <h1 className="text-24 font-pre-bold text-center mb-4">오류가 발생했습니다</h1>

        <p className="text-20 font-pre-regular text-red text-center">{error}</p>

        {showButtons && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBackClick}
              className="w-full bg-gray100 text-black rounded-xl py-2 font-pre-medium hover:bg-gray-200 transition-colors"
            >
              뒤로 가기
            </button>
            <button
              onClick={handleHomeClick}
              className="w-full bg-normal text-white rounded-xl py-2 font-pre-medium hover:bg-normal/90 transition-colors"
            >
              홈으로
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default ErrorModal;
