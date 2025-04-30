import { Link } from "react-router-dom";
import Memozy_logo from "../assets/images/Memozylogo.svg";
import monster1 from "../assets/images/monster1.png";
import profile_monster from "../assets/images/profile_monster.png";
import google_icon from "../assets/icons/google_icon.png";
import ServiceCards from "../features/LoginPage/ServiceCard";

function LoginPage() {
  return (
    <div className="max-h-screen flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center pt-12">
        {/* 로고와 슬로건 */}
        <div className="mb-8 w-52 self-start ml-4 md:ml-36">
          <img src={Memozy_logo} alt="Memozy 로고" />
        </div>

        {/* 전체 겹치는 영역을 위한 컨테이너 */}
        <div className="w-full relative mb-6">
          {/* 몬스터 이미지 - 최상단에 위치 */}
          <div className="absolute right-4 md:right-36 -top-28 z-20">
            <img src={monster1} alt="몬스터1" className="w-16 md:w-32" />
          </div>

          {/* 설명 파란 박스 */}
          <div className="relative z-10 ml-4 md:ml-36">
            <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
              <h2 className="text-20 mb-2 font-pre-medium">Memozy와 함께,</h2>
              <p className=" ml-6 text-14 font-pre-regular">
                원하는 정보를 저장하고, 복습하며, 지식을 더 쉽고 오래 내 것으로
                만드세요!
              </p>
            </div>
          </div>

          {/* 로그인 카드 - 설명 박스 위에 겹침 */}
          <div className="absolute right-4 md:right-40 top-[70px] z-30 max-w-[300px] md:max-w-[370px]">
            <div className="bg-white shadow-lg rounded-xl py-4 w-[272px] h-[280px]">
              <div className="flex justify-center mb-4 mt-6">
                <div className="w-[96px] h-[96px] bg-gray-100 rounded-full flex items-center justify-center">
                  <img
                    src={profile_monster}
                    alt="프로필 캐릭터"
                    className="w-12"
                  />
                </div>
              </div>
              <p className="text-center text-gray-600 mb-2 text-14 font-pre-regular">
                <span className="text-[#0D47A1] font-pre-semibold">
                  반가워요
                </span>
                , 지금 바로{" "}
                <span className="text-[#0D47A1] font-pre-semibold">Memozy</span>
                로
              </p>
              <p className="text-center text-gray-600 mb-4 text-14 font-pre-regular">
                기억이 쉬워지는 경험을 시작해보세요.
              </p>
              <div className="flex justify-center">
                <button className="w-[223px] h-[43px] bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors duration-200">
                  <img src={google_icon} alt="구글 아이콘" className="w-4" />
                  <span className="text-[#4285F4] font-pre-regular text-16">
                    구글 로그인
                  </span>
                </button>
              </div>
            </div>

            {/* 익스텐션 설치 버튼 - 로그인 박스 아래에 배치 */}
            <div className="mt-20 flex justify-center">
              <Link
                to="#"
                className="text-center bg-[#4285F4] font-pre-regular text-white shadow-md w-[272px] h-[43px] rounded-md hover:normalactive transition-colors duration-200 flex items-center justify-center"
              >
                익스텐션 설치하기
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full relative">
          <ServiceCards />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
