import http from "./http";

export type AuthUser = { id: string; fullName: string; email: string };

export async function login(body: { email: string; password: string }) {
  const { data } = await http.post("/v1/auth/login", body);
  return data as { user: AuthUser; accessToken: string };
}