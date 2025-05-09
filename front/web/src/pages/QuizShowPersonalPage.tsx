import { useLocation } from 'react-router';
import small_logo from '../assets/images/small_logo.png';
import { Quiz } from '../types/quizShow';
import { useState, useEffect } from 'react';
import MultipleChoice from '../components/quizShowPage/MultipleChoice';
import OX from '../components/quizShowPage/OX';
import Objective from '../components/quizShowPage/Objective';

interface QuizShowPersonalPageProps {
    collectionName: string;
    quizList: Quiz[];
}

function QuizShowPersonalPage() {
    const location = useLocation();
    const { collectionName, quizList } = location.state as QuizShowPersonalPageProps;
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

    useEffect(() => {
        if (quizList.length > 0) {
            setCurrentQuiz(quizList[0]);
        }
    }, [quizList]);

    const renderQuizComponent = (currentQuiz: Quiz) => {
        if (!currentQuiz) return null;

        switch (currentQuiz.type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoice
                    content={currentQuiz.content}
                    choice={currentQuiz.choice}
                    answer={currentQuiz.answer}
                    commentary={currentQuiz.commentary}
                />;
            case 'OX':
                return <OX 
                    content={currentQuiz.content}
                    answer={currentQuiz.answer}
                    commentary={currentQuiz.commentary}
                />;
            case 'OBJECTIVE':
                return <Objective
                    content={currentQuiz.content}
                    answer={currentQuiz.answer}
                    commentary={currentQuiz.commentary}
                />;
            default:
                return <div>지원하지 않는 퀴즈 타입입니다.</div>;
        }
    };

    const handleNextQuiz = () => {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setCurrentQuiz(quizList[currentQuizIndex + 1]);
    };

    return (
        <div className="content">
            <h1 className="text-[28px] font-pre-semibold mb-4 text-main200 flex items-center gap-2">
                <img src={small_logo} alt="logo" className="w-10 h-10" />
                Quiz : <span className="text-normalactive">{collectionName}</span>
            </h1>
            <div className="w-full h-[70vh] bg-white rounded-xl shadow-xl">
                <div>현재 몇번째 문제인지 확인하고 문제 진행도를 보여주는 component</div>
                {currentQuiz && renderQuizComponent(currentQuiz)}
                <button className="w-full h-[50px] bg-main200 text-white rounded-xl" onClick={handleNextQuiz}>다음문제</button>
            </div>
        </div>
    );
}

export default QuizShowPersonalPage;



