import { create } from "zustand";
import { collectionApi } from "../../apis/collection/colletionApi";
import { CollectionState, Quiz, Memozy, AllCollectionResponse } from "./types";

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  allCollection: null,
  memozies: [],
  quizzes: new Map<number, Quiz[]>(),
  loading: false,
  error: null,
  collectionName: null,
  // 페이지네이션 초기 상태
  currentPage: 0,
  pageSize: 10,
  hasMore: true,

  // 컬렉션 조회
  fetchCollections: async () => {
    try {
      set({ loading: true, error: null });
      const response = await collectionApi.getCollection();
      // API 응답에서 data 필드 확인
      const collectionsData = response.data?.data || [];
      set({ collections: collectionsData, loading: false });
    } catch (error) {
      set({ error: "컬렉션을 불러오는데 실패했습니다.", loading: false });
      console.error("컬렉션 조회 오류:", error);
    }
  },

  // 컬렉션 생성
  createCollection: async (title: string) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.createCollection(title);
      await get().fetchCollections(); // 컬렉션 목록 새로고침
    } catch (error) {
      set({ error: "컬렉션 생성에 실패했습니다.", loading: false });
      console.error("컬렉션 생성 오류:", error);
    }
  },

  // 컬렉션 수정
  updateCollection: async (collectionId: number, title: string) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.updateCollection(collectionId, title);
      await get().fetchCollections(); // 컬렉션 목록 새로고침
    } catch (error) {
      set({ error: "컬렉션 수정에 실패했습니다.", loading: false });
      console.error("컬렉션 수정 오류:", error);
    }
  },

  // 컬렉션 삭제
  deleteCollection: async (collectionId: number) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.deleteCollection(collectionId);
      await get().fetchCollections(); // 컬렉션 목록 새로고침
    } catch (error) {
      set({ error: "컬렉션 삭제에 실패했습니다.", loading: false });
      console.error("컬렉션 삭제 오류:", error);
    }
  },

  // 메모지 목록 조회
  fetchMemozyList: async (collectionId: number, page?: number, pageSize?: number) => {
    try {
      set({ loading: true, error: null });
      const currentPage = page ?? get().currentPage;
      const currentPageSize = pageSize ?? get().pageSize;

      const response = await collectionApi.getMemozyList(
        collectionId,
        currentPage,
        currentPageSize
      );

      // 현재 페이지의 메모지 ID 목록
      const currentMemozyIds = new Set(get().memozies.map((m: Memozy) => m.sourceId));
      // 새로운 메모지 중 중복되지 않은 것만 필터링
      const newMemozyList = response.data.data.content.filter(
        (m: Memozy) => !currentMemozyIds.has(m.sourceId)
      );

      set({
        memozies:
          currentPage === 0 ? response.data.data.content : [...get().memozies, ...newMemozyList],
        collectionName: response.data.data.collectionName,
        currentPage: currentPage,
        pageSize: currentPageSize,
        hasMore: !response.data.data.last,
        loading: false,
      });
    } catch (error) {
      set({ error: "메모지 목록을 불러오는데 실패했습니다.", loading: false });
      console.error("메모지 목록 조회 오류:", error);
    }
  },

  // 페이지 변경
  setPage: (page: number) => {
    set({ currentPage: page });
  },

  // 페이지 크기 변경
  setPageSize: (pageSize: number) => {
    set({ pageSize, currentPage: 0 }); // 페이지 크기가 변경되면 첫 페이지로 리셋
  },

  // 메모지 복제
  copyMemozy: async (copyCollectionId: number, sourceId: number[], currentCollectionId: number) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.copyMemozy(copyCollectionId, sourceId);
      // 복제 후 현재 컬렉션의 메모지 목록만 새로고침
      await get().fetchMemozyList(currentCollectionId, 0);
    } catch (error) {
      set({ error: "메모지 복제에 실패했습니다.", loading: false });
      console.error("메모지 복제 오류:", error);
    }
  },

  // 퀴즈 목록 조회
  fetchQuizList: async (sourceId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await collectionApi.getQuizList(sourceId);
      set((state) => ({
        quizzes: new Map(state.quizzes).set(sourceId, response.data.data || []),
        loading: false,
      }));
    } catch (error) {
      set({ error: "퀴즈 목록을 불러오는데 실패했습니다.", loading: false });
      console.error("퀴즈 목록 조회 오류:", error);
    }
  },

  // 퀴즈 삭제
  deleteQuiz: async (quizId: number[], sourceId: number[]) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.deleteQuiz(quizId, sourceId);
      if (sourceId.length > 0) {
        await get().fetchQuizList(sourceId[0]); // 퀴즈 목록 새로고침
      }
    } catch (error) {
      set({ error: "퀴즈 삭제에 실패했습니다.", loading: false });
      console.error("퀴즈 삭제 오류:", error);
    }
  },

  // 전체 컬렉션 조회
  fetchAllCollection: async () => {
    try {
      set({ loading: true, error: null });
      const response = await collectionApi.getAllCollection();
      set({ allCollection: response.data.data, loading: false });
    } catch (error) {
      set({ error: "전체 컬렉션을 불러오는데 실패했습니다.", loading: false });
      console.error("전체 컬렉션 조회 오류:", error);
    }
  },

  // 전체 메모지 조회
  fetchAllMemozyList: async (page?: number, pageSize?: number) => {
    try {
      set({ loading: true, error: null });
      const currentPage = page ?? get().currentPage;
      const currentPageSize = pageSize ?? get().pageSize;

      const response = await collectionApi.getAllMemozyList(currentPage, currentPageSize);

      // 현재 페이지의 메모지 ID 목록
      const currentMemozyIds = new Set(get().memozies.map((m: Memozy) => m.sourceId));
      // 새로운 메모지 중 중복되지 않은 것만 필터링
      const newMemozyList = response.data.data.content.filter(
        (m: Memozy) => !currentMemozyIds.has(m.sourceId)
      );

      set({
        memozies:
          currentPage === 0 ? response.data.data.content : [...get().memozies, ...newMemozyList],
        collectionName: response.data.data.collectionName,
        currentPage: currentPage,
        pageSize: currentPageSize,
        hasMore: !response.data.data.last,
        loading: false,
      });
    } catch (error) {
      set({ error: "메모지 목록을 불러오는데 실패했습니다.", loading: false });
      console.error("메모지 목록 조회 오류:", error);
    }
  },
}));
