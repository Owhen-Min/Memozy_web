import errorPageImage from "../assets/images/errorPageImage.svg";

function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 sm:p-10 bg-bg overflow-hidden">
      <div className="w-full max-w-[1200px] flex flex-col items-center justify-evenly">
        <h1 className="text-[40px] sm:text-[60px] md:text-[80px] font-pre-semibold text-normal">
          Error
        </h1>

        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full">
          <p className="text-[28px] font-pre-medium text-main200">이런! 문제가 발생했어요.</p>
          <p className="text-24 font-pre-medium text-red">존재하지 않는 주소입니다.</p>
        </div>

        <div className="w-full max-w-full px-4 sm:px-8 md:px-12">
          <img
            src={errorPageImage}
            alt="errorPageImage"
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto object-contain"
          />
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 sm:mt-6 md:mt-8 bg-normal hover:bg-normalhover text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full text-16 sm:text-[18px] md:text-20 font-pre-medium transition-colors"
        >
          시작화면으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
