export interface CreateCollectionRequest {
    title: string;
}

export interface UpdateCollectionRequest {
    title: string;
}

export interface CopyMemozyRequest {
    sourceId: number[];
}

export interface DeleteQuizRequest {
    quizId: number[];
    sourceId: number[];
}
