import { create } from "zustand";
import { fetchMe, login as loginApi } from "../api/auth";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  loadMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("access"),
  loading: false,
  async login(username, password) {
    set({ loading: true });
    try {
      const { access, refresh } = await loginApi(username, password);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      const user = await fetchMe();
      set({ user, token: access });
      return user;
    } finally {
      set({ loading: false });
    }
  },
  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ user: null, token: null });
  },
  async loadMe() {
    const token = localStorage.getItem("access");
    if (!token) return;
    set({ loading: true });
    try {
      const user = await fetchMe();
      set({ user, token });
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      set({ user: null, token: null });
    } finally {
      set({ loading: false });
    }
  },
}));