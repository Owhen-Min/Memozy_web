import httpClient from "../httpClient";

interface BaseResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
}

// 공유 퀴즈 결과
export interface SharedQuizShowCreateResponse extends BaseResponse {
  data: SharedQuizShowCreateData;
}

export interface SharedQuizShowCreateData {
  showId: string;
  showUrl: string;
  hostName: string;
  collectionName: string;
  quizCount: number;
}

export const sharedQuizShowApi = {
  // 결과 조회 근데 GET 아니라신다!!!
  // getSharedQuizShowResult: async (show_id: string): Promise<SharedQuizShowResult> => {
  //   const response = await httpClient.get(`/quiz/show/${show_id}/result`);
  //   return response.data;
  // },

  createSharedQuizShow: async (collectionId: string | undefined, count: number) => {
    const response = await httpClient.get(`/quiz/show/shared/${collectionId}?count=${count}`);
    return response.data;
  },
};
