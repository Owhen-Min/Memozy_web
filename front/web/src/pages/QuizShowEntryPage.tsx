import { useLocation } from 'react-router';
import Memozy_logo from "../assets/images/Memozylogo.svg";
import monster1 from "../assets/images/monster1.png";

interface QuizShowEntryPageProps {
    collectionName: string;
    collectionId: string;
    quizCount: number;
    isShared: boolean;
}

function QuizShowEntryPage() {
    const location = useLocation();
    const { collectionName, collectionId, quizCount, isShared } = location.state as QuizShowEntryPageProps;

    return (
        <div>
            <div className="content">
                <img src={Memozy_logo} alt="Memozy_logo" />
                <img src={monster1} alt="monster1" />
                <div>
                    <p>퀴즈쇼 생성 컬렉션 이름: {collectionName}</p>
                    <p>퀴즈쇼 생성 컬렉션 id: {collectionId}</p>
                    <p>퀴즈 수: {quizCount}</p>
                    <p>퀴즈쇼 타입: {isShared ? '단체 퀴즈쇼' : '개인 퀴즈쇼'}</p>
                </div>
            </div>
        </div>
    );
}

export default QuizShowEntryPage;
