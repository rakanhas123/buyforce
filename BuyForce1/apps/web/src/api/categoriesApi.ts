import { api } from "../lib/apiClient";
import type { Category, Product } from "../lib/types";

export function fetchCategories(): Promise<Category[]> {
  return api("/categories");
}

// כרגע אין לך endpoint אמיתי למוצרים לפי קטגוריה.
// כדי שהעמוד CategoryFeed לא יהיה לבן/אדום — נשתמש במוצרים ונפילטר בצד לקוח.
export async function fetchCategoryFeed(slug: string): Promise<Product[]> {
  const prods = await api<Product[]>("/products");
  return prods.filter((p) => p.category?.slug === slug);
}
