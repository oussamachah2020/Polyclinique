import api from "./api";

export const postMessage = async (messageObj) => {
  const response = await api.post("/contact", messageObj);
  return response.data;
};
export const getMessages = async (adminToken) => {
  const response = await api.get("/contact", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};
