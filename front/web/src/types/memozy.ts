interface MemozyContent {
  urlId: number;
  urlTitle: string;
  summary: string;
  quizCount: number;
}

interface MemozyData {
  collectionName: string;
  content: MemozyContent[];
  offset: number;
  page: number;
  last: boolean;
}

export interface MemozyResponse {
  success: boolean;
  errorMsg: null | string;
  errorCode: null | string;
  data: MemozyData;
}
