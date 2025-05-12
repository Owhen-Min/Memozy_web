import httpClient from "../httpClient";

export const getCollection = async () => {
  const response = await httpClient.get("/collection");
  return response.data;
};

