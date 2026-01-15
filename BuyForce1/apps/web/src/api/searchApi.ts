import { api } from "../lib/apiClient";

export function search(q: string): Promise<{ products: any[]; categories: any[] }> {
  return api(`/search?q=${encodeURIComponent(q)}`);
}
