import httpClient from "./httpClient";
import { UserInfo } from "../types/userTypes";
import { getUserInfoFromToken } from "../utils/auth";

// URL 파라미터에서 토큰 추출
export const extractTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

// 사용자 정보 가져오기 (토큰에서 직접 추출)
export const getUserInfoFromTokenApi = (token: string): UserInfo | null => {
  try {
    const userInfo = getUserInfoFromToken(token) as UserInfo;

    if (!userInfo || (typeof userInfo === "object" && "error" in userInfo)) {
      console.error("토큰에서 사용자 정보를 가져올 수 없습니다:", userInfo);
      return null;
    }

    return userInfo;
  } catch (error) {
    console.error("사용자 정보 추출 오류:", error);
    return null;
  }
};

// 백엔드에서 사용자 프로필 정보 가져오기 (필요한 경우)
export const fetchUserProfile = async (): Promise<UserInfo> => {
  try {
    const response = await httpClient.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.error("사용자 프로필 가져오기 오류:", error);
    throw new Error("사용자 프로필을 가져오는데 실패했습니다.");
  }
};
