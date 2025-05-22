import { useEffect } from "react";

export function useRefetchOnBackNavigation(refetch: () => void) {
  useEffect(() => {
    const handlePopState = () => {
      // 뒤로가기 발생 시 refetch 실행
      refetch();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [refetch]);
}
