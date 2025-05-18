import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import logo from "/favicon.png";
import { useAuthStore } from "../stores/authStore";
import closeIcon from "../assets/icons/closeIcon.svg";
function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, checkAuth } = useAuthStore();
  // 모바일 메뉴 토글 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 컴포넌트 마운트 및 라우트 변경 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
    // 라우트 변경 시 모바일 메뉴 닫기
    setIsMobileMenuOpen(false);
  }, [checkAuth, location.pathname]);

  return (
    <header className="bg-light h-14 flex items-center justify-between px-4 md:px-8 relative">
      {/* 모바일 메뉴 토글 버튼 - 모바일에서만 표시 */}
      {isLoggedIn && (
        <button
          className="md:hidden flex flex-col justify-center items-center space-y-1 z-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block w-5 h-0.5 bg-[#4285F4] transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-[#4285F4] transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-[#4285F4] transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          ></span>
        </button>
      )}

      {/* 왼쪽 메뉴 - 데스크톱에서만 기본 표시 */}
      {isLoggedIn && (
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/collection"
            className={`font-pre-medium text-[18px] transition-colors duration-200 ${
              currentPath === "/collection"
                ? "text-[#0F56B3]"
                : "text-[#4285F4] hover:text-[#0F56B3]"
            }`}
          >
            컬렉션리스트
          </Link>
          <Link
            to="/my"
            className={`font-pre-medium text-[18px] transition-colors duration-200 ${
              currentPath === "/my" ? "text-[#0F56B3]" : "text-[#4285F4] hover:text-[#0F56B3]"
            }`}
          >
            마이페이지
          </Link>
        </div>
      )}

      {/* 로고 - 항상 표시 */}
      <Link to="/">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={logo} alt="Memozy 로고" className="h-12" />
        </div>
      </Link>

      {/* 오른쪽 메뉴 - 데스크톱에서만 기본 표시 */}
      {isLoggedIn && (
        <div className="hidden md:block">
          <Link
            to="/"
            className="text-[#4285F4] font-pre-medium text-[18px] hover:text-[#0F56B3] transition-colors duration-200"
            onClick={() => useAuthStore.getState().logout()}
          >
            로그아웃
          </Link>
        </div>
      )}

      {/* 모바일 메뉴 - 토글 시 표시 */}
      {isLoggedIn && isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-6 px-4">
          {/* 모바일 메뉴 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
            <div className="w-8"></div> {/* 왼쪽 여백 균형용 */}
            <h1 className="text-center text-24 font-pre-bold text-normal">Memozy</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="메뉴 닫기"
            >
              <img src={closeIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col space-y-4 pt-4">
            <Link
              to="/collection"
              className={`font-pre-medium text-16 p-2 transition-colors duration-200 ${
                currentPath === "/collection"
                  ? "text-[#0F56B3] bg-light rounded-md"
                  : "text-[#4285F4]"
              }`}
            >
              컬렉션리스트
            </Link>
            <Link
              to="/my"
              className={`font-pre-medium text-16 p-2 transition-colors duration-200 ${
                currentPath === "/my" ? "text-[#0F56B3] bg-light rounded-md" : "text-[#4285F4]"
              }`}
            >
              마이페이지
            </Link>
            <Link
              to="/"
              className="font-pre-medium text-16 p-2 text-[#4285F4] mt-4 border-t border-gray-200 pt-4"
              onClick={() => useAuthStore.getState().logout()}
            >
              로그아웃
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
