
interface ObjectiveProps {
    content: string;
    answer: string;
    commentary: string;
    quizSessionId: string;
}   

const Objective = ({ content, answer, commentary }: ObjectiveProps) => {
    return(
        <div>
            <div>문제 내용 : {content}</div>
            <input className="w-1/2 h-10 text-normal rounded-xl border-2 border-gray-300" type="text" />
            <div>정답 : {answer}</div>
            <div>해설 : {commentary}</div>
        </div>
    );
};

export default Objective;


