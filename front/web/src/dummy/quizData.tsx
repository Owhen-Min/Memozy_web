import { QuizResponse } from '../types/quiz';

export const quizData: QuizResponse = {
    success: true,
    errorMsg: null,
    errorCode: null,
    data: [
        {
            quizId: 5,
            quizContent: "문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다. 문제 5에 대한 내용이 들어갈 자리입니다.",
            quizType: "MULTIPLE_CHOICE"
        },
        {
            quizId: 9,
            quizContent: "문제 9에 대한 내용이 들어갈 자리입니다.",
            quizType: "OBJECTIVE"
        },
        {
            quizId: 11,
            quizContent: "문제 511에 대한 내용이 들어갈 자리입니다.",
            quizType: "OX"
        }
    ]
};
