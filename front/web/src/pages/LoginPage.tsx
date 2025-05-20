import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Memozy_logo from "../assets/images/memozylogo.png";
import monster1 from "../assets/images/monster1.png";
import rightmonster from "../assets/images/rightmonster.png";
import profile_monster from "../assets/images/profile_monster.png";
import google_icon from "../assets/icons/google_icon.png";
import ServiceCards from "../features/LoginPage/ServiceCard";
import { useAuthStore } from "../stores/authStore";

function LoginPage() {
  // 애니메이션 상태 추가
  const [titleVisible, setTitleVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  // 인증 상태 가져오기
  const { isLoggedIn, userInfo, loading, error, redirectToGoogleAuth, handleAuthCallback } =
    useAuthStore();
  const location = useLocation();

  // URL에 토큰이 있는지 확인하고 처리
  useEffect(() => {
    // URL에 token 파라미터가 있는지 확인
    if (location.search.includes("token=")) {
      // OAuth 콜백 처리
      handleAuthCallback();
    }
  }, [location.search, handleAuthCallback]);

  useEffect(() => {
    // 타이틀 애니메이션 - 첫번째로 표시
    setTimeout(() => {
      setTitleVisible(true);
    }, 300);

    // 본문 애니메이션 - 타이틀 후에 표시
    setTimeout(() => {
      setTextVisible(true);
    }, 800);
  }, []);

  // 사용자 이름 표시 로직
  const getUserDisplayName = (): string => {
    if (!userInfo) return "";

    // 사용자 정보에서 이름 추출
    return userInfo.name?.toString() || userInfo.nickname?.toString() || "사용자";
  };

  // 구글 로그인 처리
  const handleGoogleLogin = () => {
    redirectToGoogleAuth();
  };

  return (
    <div className="max-h-screen flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center pt-12">
        <div className="mb-4 lg:mb-8 w-40 lg:w-52 self-start ml-4 lg:ml-36">
          <img src={Memozy_logo} alt="Memozy 로고" />
        </div>

        {/* 전체 겹치는 영역 */}
        <div className="w-full relative mb-6">
          {/* 몬스터 이미지 - 최상단에 위치 */}
          <div className="absolute right-4 lg:right-36 -top-28 z-20 hidden lg:block">
            <img src={monster1} alt="몬스터1" className="w-16 lg:w-32" />
          </div>

          {/* 설명 파란 박스 */}
          <div className="relative z-10 ml-4 lg:ml-36 hidden lg:block">
            <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
              <h2
                className={`text-20 mb-2 font-pre-medium transform transition-all duration-700 ${
                  titleVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Memozy와 함께,
              </h2>
              <p
                className={`ml-16 text-14 font-pre-regular transform transition-all duration-700 ${
                  textVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                원하는 정보를 저장하고, 복습하며, 지식을 더 쉽고 오래 내 것으로 만드세요!
              </p>
            </div>
          </div>

          {/* 서비스 카드와 로그인 카드를 감싸는 컨테이너 */}
          <div className="w-full flex justify-center mt-8 px-8 lg:px-4">
            {/* 서비스 카드 섹션 - 모바일에서는 숨김 */}
            <div className="hidden lg:block">
              <div className="w-[530px] mr-[200px]">
                <ServiceCards />
              </div>
            </div>

            {/* 로그인 카드  */}
            <div className="relative mt-2 lg:-mt-20 z-20">
              <div className="bg-white shadow-lg rounded-xl py-4 w-[272px] h-[280px]">
                {loading ? (
                  // 로딩 상태
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  // 에러 발생 상태
                  <div className="flex flex-col items-center justify-center h-full px-4">
                    <p className="text-red-500 text-center mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-[#4285F4] text-white rounded-md"
                    >
                      새로고침
                    </button>
                  </div>
                ) : isLoggedIn && userInfo ? (
                  // 로그인 상태
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-[96px] h-[96px] bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <img src={profile_monster} alt="프로필 캐릭터" className="w-12" />
                    </div>
                    <p className="text-center text-gray-600 mb-2 text-14 font-pre-regular">
                      <span className="text-[#0D47A1] font-pre-semibold text-18">
                        {getUserDisplayName()}
                      </span>
                      님, 안녕하세요!
                    </p>
                    <p className="text-center text-gray-600 mb-2 text-14 font-pre-regular">
                      <span className="text-[#0D47A1] font-pre-semibold">메모지</span>
                      처럼 머릿속을 가득 채우며,
                      <br />한 걸음 더 성장하는 하루를 시작해요
                    </p>
                  </div>
                ) : (
                  // 로그인 전 상태
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-[96px] h-[96px] bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <img src={profile_monster} alt="프로필 캐릭터" className="w-12" />
                    </div>
                    <p className="text-center text-gray-600 mb-2 text-14 font-pre-regular">
                      <span className="text-[#0D47A1] font-pre-semibold">반가워요</span>, 지금 바로{" "}
                      <span className="text-[#0D47A1] font-pre-semibold">Memozy</span>로
                    </p>
                    <p className="text-center text-gray-600 mb-4 text-14 font-pre-regular">
                      기억이 쉬워지는 경험을 시작해보세요.
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={handleGoogleLogin}
                        className="w-[223px] h-[43px] bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <img src={google_icon} alt="구글 아이콘" className="w-4" />
                        <span className="text-[#4285F4] font-pre-medium text-16">구글 로그인</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 익스텐션 설치 버튼 */}
              <div className="mt-20 flex justify-center hidden lg:flex">
                <Link
                  to="https://chromewebstore.google.com/detail/memozy/edkigpibifokljeefiomnfadenbfcchj"
                  className="text-center bg-[#4285F4] font-pre-regular text-white shadow-md w-[272px] h-[43px] rounded-md hover:normalactive transition-colors duration-200 flex items-center justify-center"
                >
                  익스텐션 설치하기
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일에서만 보이는 오른쪽 아래 몬스터 */}
        <div className="fixed bottom-4 right-4 lg:hidden">
          <img src={rightmonster} alt="오른쪽 몬스터" className="w-32" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
