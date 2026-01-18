import { api } from "../lib/apiClient";
import type { Product, Group } from "../lib/types";

export function fetchProducts(): Promise<Product[]> {
  return api("/products");
}

export function fetchProduct(id: string): Promise<Product> {
  return api(`/products/${id}`);
}

export function fetchProductGroup(id: string): Promise<Group> {
  return api(`/products/${id}/group`);
}

export async function joinGroup(groupId: string): Promise<{ ok: boolean }> {
  // זה הנתיב שיש לך בשרת: POST /v1/groups/:id/join
  return api(`/groups/${groupId}/join`, { method: "POST" });
}
