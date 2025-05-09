interface OXProps {
    content: string;
    answer: string;
    commentary: string;
}   

const OX = ({ content, answer, commentary }: OXProps) => {
    return(
        <div>
            <div>{content}</div>
            <div>{answer}</div>
            <div>{commentary}</div>
        </div>
    );
};

export default OX;


