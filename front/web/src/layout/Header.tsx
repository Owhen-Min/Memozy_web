import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const currentPath = location.pathname;

  return (
    <header className="bg-light h-12 flex items-center justify-between px-8 relative">
      {/* 왼쪽 메뉴 */}
      {!isLoginPage && (
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

      {/* 로고 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img src={logo} alt="Memozy 로고" className="h-10" />
      </div>

      {/* 오른쪽 메뉴 */}
      {!isLoginPage && (
        <div>
          <Link
            to="/login"
            className="text-[#4285F4] font-pre-medium text-[16px] hover:text-[#0F56B3] transition-colors duration-200"
          >
            로그아웃
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
