
interface ObjectiveProps {
    content: string;
    answer: string;
    commentary: string;
}   

const Objective = ({ content, answer, commentary }: ObjectiveProps) => {
    return(
        <div>
            <div>{content}</div>
            <div>{answer}</div>
            <div>{commentary}</div>
        </div>
    );
};

export default Objective;


