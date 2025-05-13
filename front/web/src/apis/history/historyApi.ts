import httpClient from "../httpClient";
//학습참여도
export const fetchLearningContribution = async (year?: number) => {
  try {
    const response = await httpClient.get(`/history/streaks`, {
      params: { year },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.errorMsg || "Unknown error");
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    throw error;
  }
};

//전체퀴즈,푼퀴즈 개수
export const fetchQuizStats = async () => {
  try {
    const response = await httpClient.get(`/history/quiz/stats`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.errorMsg || "Unknown error");
    }
  } catch (error) {
    console.error("퀴즈 통계 데이터 요청 중 오류 발생:", error);
    throw error;
  }
};
