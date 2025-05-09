import { useState } from 'react';
import OIcon from '../../assets/icons/OIcon.svg';
import XIcon from '../../assets/icons/XIcon.svg';

interface OXProps {
    content: string;
    answer: string;
    commentary: string;
    quizSessionId: string;
}   

const OX = ({ content }: OXProps) => {
    const [selected, setSelected] = useState<null | 'O' | 'X'>(null);

    return(
        <div>
            <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-8 text-20 font-pre-medium">
                문제 내용 : {content}
            </div>
            <div className="w-full flex justify-center gap-32">
                <button
                    className={`transition-transform duration-200 hover:scale-110 rounded-xl p-4
                        ${selected === 'O' ? 'bg-lighthover' : ''}`}
                    onClick={() => setSelected('O')}
                >
                    <img className="w-[150px] h-[150px]" src={OIcon} alt="OIcon" />
                </button>
                <button
                    className={`transition-transform duration-200 hover:scale-110 rounded-xl p-4
                        ${selected === 'X' ? 'bg-lighthover' : ''}`}
                    onClick={() => setSelected('X')}
                >
                    <img className="w-[150px] h-[150px]" src={XIcon} alt="XIcon" />
                </button>
            </div>
            {/* <div>정답 : {answer}</div>
            <div>해설 : {commentary}</div> */}
        </div>
    );
};

export default OX;


