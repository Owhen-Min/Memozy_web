
interface MultipleChoiceProps {
    content: string;
    choice: string[] | null;
    answer: string;
    commentary: string;
}

const MultipleChoice = ({ content, choice, answer, commentary }: MultipleChoiceProps) => {
    return(
        <div>
            <div>{content}</div>
            <div>{choice?.map((item, index) => (
                <div key={index}>{item}</div>
            ))}</div>
            <div>{answer}</div>
            <div>{commentary}</div>
        </div>
    );
};

export default MultipleChoice;


