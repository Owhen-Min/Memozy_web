export interface Memozy {
  sourceId: number;
  sourceTitle: string;
  summary: string;
  quizCount: number;
}

export interface MemozyListResponse {
  success: boolean;
  errorMsg: null | string;
  errorCode: null | string;
  data: {
    collectionName: string;
    content: Memozy[];
    last: boolean;
  };
}
