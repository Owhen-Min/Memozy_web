import { QuizShowResponse } from "../types/quizShow";

export const quizShowData: QuizShowResponse = {
    success: true,
    errorMsg: null,
    errorCode: null,
    data: {
        collectionName: "컬렉션 이름",
        quizSessionId: "session123",
        quizList: [
            {
                quizId: 1,
                content: "프랑스의 수도는 파리인가?",
                type: "MULTIPLE_CHOICE",
                choice: ["로마", "서울", "도쿄", "파리"],
                answer: "파리",
                commentary: "해설"
            },
            {
                quizId: 2,
                content: "지구는 평평한가?",
                type: "OX",
                choice: null,
                answer: "X",
                commentary: "지구는 구형이다. 해설"
            },
            {
                quizId: 3,
                content: "우리 나라 1등 기업 이름은? (한글로)",
                choice: null,
                type: "OBJECTIVE",
                answer: "삼성",
                commentary: "삼성은 우리 나라 최고 규모의 기업이다."
            }
        ]
    }
}