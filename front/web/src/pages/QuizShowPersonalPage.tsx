import { useLocation } from 'react-router-dom';
import small_logo from '../assets/images/small_logo.png';
// import { Quiz } from '../types/quizShow';

interface QuizShowPersonalPageProps {
    collectionName: string;
    // quizCount: number;
    // quizList: Quiz[];
}

function QuizShowPersonalPage() {
    const location = useLocation();
    const { collectionName } = location.state as QuizShowPersonalPageProps;

    return (
        <div className="content">
            <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
                <img src={small_logo} alt="logo" className="w-10 h-10" />
                Quiz : <span className="text-normalactive">{collectionName}</span>
            </h1>
            <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl">
                문제 나오는 자리
            </div>
        </div>
    );
}

export default QuizShowPersonalPage;



