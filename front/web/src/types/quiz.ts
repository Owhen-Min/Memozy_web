export type QuizType = 'MULTIPLE_CHOICE' | 'OBJECTIVE' | 'OX';

export interface Quiz {
    quizId: number;
    quizContent: string;
    quizType: QuizType;
}

export interface QuizResponse {
    success: boolean;
    errorMsg: null | string;
    errorCode: null | string;
    data: Quiz[];
}
