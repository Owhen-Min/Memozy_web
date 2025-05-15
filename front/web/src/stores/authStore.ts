import { create } from "zustand";
import {
  clearTokens,
  isAuthenticated,
  setAccessToken,
  setUserInfo,
  getUserInfo,
} from "../utils/auth";
import { UserInfo } from "../types/user";
import { getUserInfoFromTokenApi, extractTokenFromUrl } from "../apis/authApi";

// 인증 상태 인터페이스
interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;

  // 액션
  checkAuth: () => void;
  login: (token: string) => void;
  logout: () => void;
  redirectToGoogleAuth: () => void;
  handleAuthCallback: () => Promise<void>;
}

// 구글 로그인 URL
const GOOGLE_AUTH_URL = "https://test.memozy.site/oauth2/authorization/google?state=mode:web";

// Auth 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: isAuthenticated(),
  userInfo: getUserInfo() as UserInfo | null,
  loading: false,
  error: null,

  // 인증 상태 확인
  checkAuth: () => {
    const authStatus = isAuthenticated();
    set({ isLoggedIn: authStatus });

    // 로그인 상태인데 userInfo가 없으면 로드
    if (authStatus && get().userInfo === null) {
      const savedUserInfo = getUserInfo() as UserInfo | null;
      if (savedUserInfo) {
        set({ userInfo: savedUserInfo });
      }
    }
    // 로그인 상태가 아닌데 userInfo가 있으면 초기화
    else if (!authStatus && get().userInfo !== null) {
      set({ userInfo: null });
    }
  },

  // 로그인 처리
  login: (token: string) => {
    try {
      set({ loading: true, error: null });

      // 토큰 저장
      const tokenSaved = setAccessToken(token);
      if (!tokenSaved) {
        set({ error: "토큰 저장에 실패했습니다.", loading: false });
        return;
      }

      // 토큰에서 사용자 정보 추출
      const userInfo = getUserInfoFromTokenApi(token);
      if (!userInfo) {
        set({
          error: "사용자 정보를 가져오는데 실패했습니다.",
          loading: false,
        });
        return;
      }

      // 사용자 정보 저장
      setUserInfo(userInfo);

      // 상태 업데이트
      set({
        isLoggedIn: true,
        userInfo,
        loading: false,
        error: null,
      });

      console.log("로그인 성공:", userInfo.name);
    } catch (error) {
      console.error("로그인 처리 오류:", error);
      set({
        error: "로그인 처리 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  // 로그아웃 처리
  logout: () => {
    clearTokens();

    set({
      isLoggedIn: false,
      userInfo: null,
      error: null,
      loading: false,
    });

    // 홈으로 이동
    window.location.href = "/";
  },

  // 구글 로그인 페이지로 리다이렉트
  redirectToGoogleAuth: () => {
    try {
      // 현재 시간을 쿼리 파라미터로 추가하여 캐시 방지
      const redirectUrl = `${GOOGLE_AUTH_URL}&t=${Date.now()}`;
      console.log("구글 로그인 페이지로 이동:", redirectUrl);

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("구글 인증 리다이렉트 오류:", error);
      set({ error: "구글 로그인 페이지로 이동 중 오류가 발생했습니다." });
    }
  },

  // OAuth 콜백 처리
  handleAuthCallback: async () => {
    try {
      set({ loading: true, error: null });

      // URL에서 토큰 추출
      const token = extractTokenFromUrl();

      if (!token) {
        console.log("URL에서 토큰을 찾을 수 없습니다.");
        set({ loading: false });
        return;
      }

      // 로그인 처리
      get().login(token);

      // URL에서 토큰 파라미터 제거 (보안 목적)
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("OAuth 콜백 처리 오류:", error);
      set({
        error: "로그인 처리 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },
}));
