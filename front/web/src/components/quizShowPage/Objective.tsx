interface ObjectiveProps {
    content: string;
    answer: string;
    commentary: string;
    quizSessionId: string;
}   

const Objective = ({ content }: ObjectiveProps) => {
    return(
        <div>
            <div className="w-full h-[180px] border-2 border-normal rounded-xl p-4 my-4 text-20 font-pre-medium">
                문제 내용 : {content}
            </div>
            <input
                className="
                    block mx-auto mt-20 w-1/2 h-12 px-4 py-2
                    text-20 font-pre-medium text-main200
                    rounded-xl border-2 border-gray100
                    focus:outline-none focus:border-main200
                    placeholder-gray-400
                    shadow-sm
                "
                type="text"
                placeholder="정답을 입력하세요..."
            />
            {/* <div>정답 : {answer}</div>
            <div>해설 : {commentary}</div> */}
        </div>
    );
};

export default Objective;


