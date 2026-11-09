import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccess(): Promise<string> {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");
  const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
  const newAccess = res.data.access as string;
  localStorage.setItem("access", newAccess);
  return newAccess;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) refreshing = refreshAccess().finally(() => (refreshing = null));
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);