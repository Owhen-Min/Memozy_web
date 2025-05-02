import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { clearTokens, getAccessToken } from "../utils/auth";

// API 서버 URL 설정
const baseURL = import.meta.env.VITE_SERVER_URL || "http://memozy.site";

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
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 에러 응답이 401(Unauthorized)인 경우 처리
    if (error.response && error.response.status === 401) {
      // 인증 실패 시 토큰 제거 로그인 페이지로 리다이렉트
      clearTokens();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default httpClient;
