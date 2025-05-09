import OIcon from '../../assets/icons/OIcon.svg';
import XIcon from '../../assets/icons/XIcon.svg';
interface OXProps {
    content: string;
    answer: string;
    commentary: string;
    quizSessionId: string;
}   

const OX = ({ content, answer, commentary, quizSessionId }: OXProps) => {
    return(
        <div>
            <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-8 text-20 font-pre-medium">
                문제 내용 : {content}
            </div>
            <div className="w-full flex justify-center gap-32">
                <button><img className="w-[150px] h-[150px]" src={OIcon} alt="OIcon" /></button>
                <button><img className="w-[150px] h-[150px]" src={XIcon} alt="XIcon" /></button>
            </div>
            {/* <div>정답 : {answer}</div>
            <div>해설 : {commentary}</div> */}
        </div>
    );
};

export default OX;


