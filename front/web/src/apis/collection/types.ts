export interface Collection {
    id: string;
    title: string;
}

export interface CollectionResponse {
    success: boolean;
    errorMsg: string | null;
    errorCode: string | null;
    data: Collection[];
}

export interface CreateCollectionRequest {
    title: string;
}
