import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { clearTokens, getAccessToken } from "../utils/auth";
import { useErrorStore } from "../stores/errorStore";

// API 서버 URL 설정
const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// API 응답 타입 정의
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errorMsg?: string;
}

// Axios 인스턴스 생성
const httpClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
httpClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // API 응답이 success: false인 경우 에러 처리
    if (response.data && response.data.success === false) {
      const errorMessage = response.data.errorMsg || "Unknown error";
      // zustand store에 직접 접근
      useErrorStore.getState().setError(errorMessage, { showButtons: false });
      return Promise.reject(new Error(errorMessage));
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 에러 응답이 401(Unauthorized)인 경우 처리
    if (error.response && error.response.status === 401) {
      // 인증 실패 시 토큰 제거 로그인 페이지로 리다이렉트
      clearTokens();
      window.location.href = "/";
    }

    // 그 외 API 에러 처리
    const errorMessage =
      error.response?.data?.errorMsg || error.message || "서버 연결에 실패했습니다";

    useErrorStore.getState().setError(errorMessage, { showButtons: false });
    return Promise.reject(error);
  }
);

export default httpClient;
