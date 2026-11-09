import { api } from "./client";
import type { AuthTokens, User } from "../types";

export async function login(username: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/auth/login/", { username, password });
  return data;
}

export async function register(payload: {
  username: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> {
  const { data } = await api.post<User>("/auth/register/", payload);
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me/");
  return data;
}