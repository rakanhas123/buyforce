// apps/web/src/api/homeApi.ts
import { api } from "../lib/apiClient";

export type HomeSection = {
  key: string;
  title: string;
  items: any[];
};

export async function fetchHomeSections(): Promise<HomeSection[]> {
  const data = await api<any>("/home/sections");
  return Array.isArray(data) ? data : (data?.items ?? data?.sections ?? []);
}
