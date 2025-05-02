// 토큰 관련 상수
const ACCESS_TOKEN_KEY = "memozy_access_token";
const USER_INFO_KEY = "memozy_user_info";

/**
 * 액세스 토큰을 로컬 스토리지에 저장합니다.
 */
export const setAccessToken = (token: string): boolean => {
  try {
    // 토큰 유효성 간단 검사
    if (!token || token.trim() === "") {
      console.error("토큰이 유효하지 않습니다");
      return false;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("토큰 저장 실패:", error);
    return false;
  }
};

/**
 * 사용자 정보를 로컬 스토리지에 저장합니다.
 */
export const setUserInfo = (userInfo: unknown): boolean => {
  try {
    if (!userInfo) {
      return false;
    }
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error("사용자 정보 저장 실패:", error);
    return false;
  }
};

/**
 * 액세스 토큰을 로컬 스토리지에서 가져옵니다.
 */
export const getAccessToken = (): string | null => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 사용자 정보를 로컬 스토리지에서 가져옵니다.
 */
export const getUserInfo = (): unknown | null => {
  try {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (!userInfoStr) return null;

    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    return null;
  }
};

/**
 * 토큰과 사용자 정보를 모두 삭제합니다. (로그아웃 시 사용)
 */
export const clearTokens = (): void => {
  try {
    // 인증 관련 데이터 모두 삭제
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);

    // 추가로 세션 스토리지에서도 삭제
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_INFO_KEY);

    console.log("모든 인증 데이터가 삭제되었습니다.");
  } catch (error) {
    console.error("토큰 제거 실패:", error);
  }
};

/**
 * 토큰 존재 여부로 로그인 상태를 확인합니다.
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = getAccessToken();
    return !!token && token.trim() !== "";
  } catch (error) {
    console.error("인증 상태 확인 실패:", error);
    return false;
  }
};

/**
 * JWT 토큰에서 페이로드(payload) 부분을 추출합니다.
 */
export const parseJwt = (token: string): unknown => {
  try {
    // 토큰이 JWT 형식인지 확인 (헤더.페이로드.서명 형식)
    if (!token.includes(".")) {
      return { token };
    }

    // JWT는 header.payload.signature 형태로 구성됨
    const parts = token.split(".");

    if (parts.length !== 3) {
      return {
        error: "Invalid token format",
      };
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    try {
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch {
      return {
        error: "Decoding error",
      };
    }
  } catch (error) {
    console.error("토큰 파싱 실패:", error);
    return {
      error: "Parsing error",
    };
  }
};

/**
 * 토큰에서 사용자 정보를 추출합니다.
 */
export const getUserInfoFromToken = (token: string): unknown => {
  try {
    if (!token) return null;

    // 토큰이 이미 JSON 객체인 경우 (비표준)
    if (token.startsWith("{") && token.endsWith("}")) {
      try {
        return JSON.parse(token);
      } catch {
        // JSON 파싱 실패
        return null;
      }
    }

    return parseJwt(token);
  } catch (error) {
    console.error("토큰에서 사용자 정보 추출 실패:", error);
    return null;
  }
};
