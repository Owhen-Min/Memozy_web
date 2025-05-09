import { useNavigate, useParams } from 'react-router';
import small_logo from "../assets/images/small_logo.png";
import Memozy_logo from "../assets/images/Memozylogo.svg";
import monster1 from "../assets/images/monster1.png";
import { quizShowData } from "../dummy/quizShowData";

const QuizShowEntryPersonalPage = () => {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const handleStartQuizShow = () => {
        navigate(`/quiz-show/personal/${collectionId}`,
            {state:{
                collectionName:quizShowData.data.collectionName,
                quizList:quizShowData.data.quizList
            }});

    }

    return (
        <div className="content">
            <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
                <img src={small_logo} alt="logo" className="w-10 h-10" />
                Quiz : <span className="text-normalactive">{quizShowData.data.collectionName}</span>
            </h1>
            <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl">
                <div className="flex flex-col items-center pt-12">
                    <div className="mb-8 w-52 self-start ml-1 md:ml-16">
                        <img src={Memozy_logo} alt="Memozy 로고" />
                    </div>

                    <div className="w-full relative mb-6">
                        <div className="absolute right-4 md:right-32 -top-28 z-20">
                            <img src={monster1} alt="몬스터1" className="w-16 md:w-32" />
                        </div>

                        <div className="relative z-10 ml-4 md:ml-32">
                            <div className="bg-[#4285F4] text-white p-8 rounded-tl-xl rounded-bl-xl font-pre-medium h-[130px] w-full flex flex-col justify-center">
                                <h2 className="text-20 mb-2 font-pre-medium">
                                    퀴즈쇼 생성이 완료되었어요!
                                </h2>
                                <p className="text-14 font-pre-regular">
                                    준비가 되시면 시작하기 버튼을 눌러 퀴즈쇼를 시작해주세요.
                                </p>
                            </div>
                        </div>

                        <div className="absolute right-4 md:right-40 top-[70px] z-30">
                            <div className="bg-white shadow-lg rounded-xl p-6 font-pre-medium">
                                <p>컬렉션 : <span className="text-16 font-pre-bold">{quizShowData.data.collectionName}</span></p>
                                <p>퀴즈 수 : <span className="text-16 font-pre-bold">{quizShowData.data.quizList.length} 문항</span></p>
                                <p>퀴즈쇼 타입 : <span className="text-16 font-pre-bold">개인 퀴즈쇼</span></p>
                                <button 
                                    className="w-full bg-light text-main200 font-pre-bold mt-4 p-2 rounded-md border-[1px] border-normal hover:bg-lighthover"
                                    onClick={handleStartQuizShow}
                                >
                                    시작하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizShowEntryPersonalPage;


