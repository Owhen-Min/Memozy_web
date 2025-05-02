import errorPageImage from '../assets/images/errorPageImage.svg';

function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-5 bg-bg">
            <h1 className="text-[80px] font-pre-semibold mb-10 text-main200">Error</h1>
            <p className="text-[16px] font-pre-medium text-main200 mb-4">이런! 문제가 발생했어요.</p>
            <p className="text-[16px] font-pre-medium text-red">error message : 존재하지 않는 주소입니다.</p>
            <img src={errorPageImage} alt="errorPageImage" className="max-w-[500px]" />
            <button 
                onClick={() => window.location.href = '/'} 
                className="bg-normal hover:bg-normalhover text-white px-8 py-4 rounded-full text-[20px] font-pre-medium transition-colors"
            >
                시작화면으로 돌아가기
            </button>
        </div>
    );
}

export default ErrorPage;
