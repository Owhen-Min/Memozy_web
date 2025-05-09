import { Link, useLocation } from "react-router";
import { useEffect } from "react";
import logo from "/favicon.png";
import { useAuthStore } from "../stores/authStore";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 컴포넌트 마운트 및 라우트 변경 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth, location.pathname]);

  return (
    <header className="bg-light h-12 flex items-center justify-between px-8 relative">
      {/* 왼쪽 메뉴 - 로그인된 상태에서만 표시 */}
      {isLoggedIn && (
        <div className="flex items-center space-x-6">
          <Link
            to="/collection"
            className={`font-pre-medium text-[16px] transition-colors duration-200 ${
              currentPath === "/collection"
                ? "text-[#0F56B3]"
                : "text-[#4285F4] hover:text-[#0F56B3]"
            }`}
          >
            컬렉션리스트
          </Link>
          <Link
            to="/my"
            className={`font-pre-medium text-[16px] transition-colors duration-200 ${
              currentPath === "/my"
                ? "text-[#0F56B3]"
                : "text-[#4285F4] hover:text-[#0F56B3]"
            }`}
          >
            마이페이지
          </Link>
        </div>
      )}

      {/* 로고 - 항상 표시 */}
      <Link to="/">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={logo} alt="Memozy 로고" className="h-8" />
        </div>
      </Link>

      {/* 오른쪽 메뉴 - 로그인된 상태에서만 표시 */}
      {isLoggedIn && (
        <div>
          <Link
            to="/"
            className="text-[#4285F4] font-pre-medium text-[16px] hover:text-[#0F56B3] transition-colors duration-200"
            onClick={() => useAuthStore.getState().logout()}
          >
            로그아웃
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
