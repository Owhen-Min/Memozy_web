export interface Collection {
    id: number;
    name: string;
    memozyCount: number;
    quizCount: number;
}

export interface CollectionResponse {
    success: boolean;
    errorMsg: string | null;
    errorCode: string | null;
    data: Collection[];
} 