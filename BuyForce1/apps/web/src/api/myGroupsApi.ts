import { api } from "../lib/apiClient";

export type MyGroupItem = {
  id: string;
  productId: string;
  name: string;
  minParticipants: number;
  joinedCount: number;
  progress: number;
  status: "OPEN" | "LOCKED" | "CHARGED" | "FAILED";
  endsAt: string;

  productName?: string | null;
  priceRegular?: string | number | null;
  priceGroup?: string | number | null;
};

export async function fetchMyGroups(): Promise<MyGroupItem[]> {
  const data = await api<{ items: MyGroupItem[] }>("/groups/my");
  return data.items ?? [];
}
