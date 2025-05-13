import { create } from "zustand";
import { collectionApi } from "../../apis/collection/colletionApi";
import { CollectionState } from "./types";

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  memozies: [],
  quizzes: [],
  loading: false,
  error: null,

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
  fetchMemozyList: async (collectionId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await collectionApi.getMemozyList(collectionId);
      set({ memozies: response.data, loading: false });
    } catch (error) {
      set({ error: "메모지 목록을 불러오는데 실패했습니다.", loading: false });
      console.error("메모지 목록 조회 오류:", error);
    }
  },

  // 메모지 복제
  copyMemozy: async (copyCollectionId: number, sourceId: number[]) => {
    try {
      set({ loading: true, error: null });
      await collectionApi.copyMemozy(copyCollectionId, sourceId);
      await get().fetchMemozyList(copyCollectionId); // 메모지 목록 새로고침
    } catch (error) {
      set({ error: "메모지 복제에 실패했습니다.", loading: false });
      console.error("메모지 복제 오류:", error);
    }
  },

  // 퀴즈 목록 조회
  fetchQuizList: async (memozyId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await collectionApi.getQuizList(memozyId);
      set({ quizzes: response.data, loading: false });
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
}));
