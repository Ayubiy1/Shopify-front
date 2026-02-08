import axios from "axios";

const api = axios.create({
  baseURL: "https://angry-korie-developerayubiy-4da36956.koyeb.app",
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
