import { Navigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증된 사용자만 접근할 수 있는 경로를 보호하는 컴포넌트
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 라우트 진입 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    console.log("인증되지 않은 접근 시도 - 로그인 페이지로 리다이렉트");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
