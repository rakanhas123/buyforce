import { api } from "../lib/apiClient";

export type Group = {
  id: string;
  name?: string | null;
  description?: string | null;

  // חשוב: הבקאנד שלך מחזיר כנראה joinedCount/minParticipants/progress/status
  joinedCount: number;
  minParticipants: number;
  progress: number;
  status: string;

  // ב-details
  isJoined?: boolean;
  canPay?: boolean;
  endsAt?: string | null;

  // לפעמים יש גם productId (לא חובה לכל המסכים)
  productId?: string | null;
};

type ListResponse = { items: Group[] };
type OneResponse = { item: Group };

export async function getGroups(): Promise<Group[]> {
  const res = await api<ListResponse>("/groups");
  return res.items ?? [];
}

export async function getMyGroups(): Promise<Group[]> {
  const res = await api<ListResponse>("/groups/my");
  return res.items ?? [];
}

export async function getGroup(id: string): Promise<Group> {
  const res = await api<OneResponse>(`/groups/${id}`);
  return res.item;
}

export async function joinGroup(id: string): Promise<{ ok: boolean }> {
  return api(`/groups/${id}/join`, { method: "POST" });
}

export async function leaveGroup(id: string): Promise<{ ok: boolean }> {
  return api(`/groups/${id}/leave`, { method: "DELETE" });
}
