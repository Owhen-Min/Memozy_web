import httpClient from "../httpClient";
import {
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CopyMemozyRequest,
  DeleteQuizRequest,
  DeleteCollectionRequest,
} from "./types";

export const collectionApi = {
  //all 컬렉션 조회
  getAllCollection: async () => {
    const response = await httpClient.get("/collection/all");
    return response;
  },

  //all memozy 조회
  getAllMemozyList: async (page?: number, pageSize?: number) => {
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append("page", page.toString());
    if (pageSize !== undefined) queryParams.append("pageSize", pageSize.toString());

    const response = await httpClient.get(`/collection/url/all?${queryParams.toString()}`);
    return response;
  },

  // 컬렉션 조회
  getCollection: async () => {
    const response = await httpClient.get("/collection");
    return response;
  },

  // 컬렉션 추가
  createCollection: async (title: string) => {
    const requestData: CreateCollectionRequest = {
      title: title,
    };
    const response = await httpClient.post("/collection", requestData);
    return response;
  },

  //컬렉션 삭제
  deleteCollection: async (collectionId: number) => {
    const requestData: DeleteCollectionRequest = {
      collectionId: collectionId,
    };
    const response = await httpClient.delete("/collection", { data: requestData });
    return response;
  },

  //컬렉션 이름 변경
  updateCollection: async (collectionId: number, title: string) => {
    const requestData: UpdateCollectionRequest = {
      title: title,
    };
    const response = await httpClient.patch(`/collection/${collectionId}`, requestData);
    return response;
  },

  //memozy 목록 조회
  getMemozyList: async (collectionId: number, page?: number, pageSize?: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append("collectionId", collectionId.toString());
    if (page !== undefined) queryParams.append("page", page.toString());
    if (pageSize !== undefined) queryParams.append("pageSize", pageSize.toString());

    const response = await httpClient.get(`/collection/url?${queryParams.toString()}`);
    return response;
  },

  //quiz 목록 조회
  getQuizList: async (sourceId: number) => {
    const response = await httpClient.get(`/collection/url/${sourceId}/quiz`);
    return response;
  },

  //memozy 복제
  copyMemozy: async (copyCollectionId: number, sourceId: number[]) => {
    const requestData: CopyMemozyRequest = {
      sourceId: sourceId,
    };

    const response = await httpClient.post(
      `/collection/quiz/copy/${copyCollectionId}`,
      requestData
    );
    return response;
  },

  //quiz 삭제
  deleteQuiz: async (quizId: number[], sourceId: number[]) => {
    const requestData: DeleteQuizRequest = {
      quizId: quizId,
      sourceId: sourceId,
    };

    const response = await httpClient.delete(`/collection/quiz`, { data: requestData });
    return response;
  },
};
