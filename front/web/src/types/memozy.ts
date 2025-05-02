export interface MemozyContent {
    urlId: number;
    urlTitle: string;
    summary: string;
    quizCount: number;
}

export interface MemozyData {
    collectionName: string;
    content: MemozyContent[];
    offset: number;
    page: number;
    last: boolean;
}

export interface MemozyResponse {
    success: boolean;
    errorMsg: string | null;
    errorCode: string | null;
    data: MemozyData;
}
