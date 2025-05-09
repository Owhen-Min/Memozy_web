import httpClient from "./httpClient";

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
