export interface Collection {
  id: number;
  name: string;
  memozyCount: number;
  quizCount: number;
}
export interface Quiz {
  quizId: number;
  quizContent: string;
  quizType: string;
}

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

export interface CollectionState {
  collections: Collection[];
  memozies: Memozy[];
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  collectionName: string | null;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;

  // 컬렉션 관련 액션
  fetchCollections: () => Promise<void>;
  createCollection: (title: string) => Promise<void>;
  updateCollection: (collectionId: number, title: string) => Promise<void>;
  deleteCollection: (collectionId: number) => Promise<void>;

  // 메모지 관련 액션
  fetchMemozyList: (collectionId: number, page?: number, pageSize?: number) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  copyMemozy: (copyCollectionId: number, sourceId: number[]) => Promise<void>;

  // 퀴즈 관련 액션
  fetchQuizList: (memozyId: number) => Promise<void>;
  deleteQuiz: (quizId: number[], sourceId: number[]) => Promise<void>;
}
