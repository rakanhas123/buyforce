import http from "./http";

export type Group = {
  id: string;
  name: string;
  description?: string;
  joinedCount: number;
  minParticipants: number;
  progress: number;
  status: string;
  isJoined?: boolean;
  canPay?: boolean;
};

export async function getGroups(): Promise<Group[]> {
  const { data } = await http.get("/v1/groups");
  return data.items;
}

export async function getMyGroups(): Promise<Group[]> {
  const { data } = await http.get("/v1/groups/my");
  return data.items;
}

export async function getGroupById(id: string): Promise<Group> {
  const { data } = await http.get(`/v1/groups/${id}`);
  return data.item;
}

export async function joinGroup(id: string) {
  const { data } = await http.post(`/v1/groups/${id}/join`);
  return data;
}

export async function leaveGroup(id: string) {
  const { data } = await http.delete(`/v1/groups/${id}/leave`);
  return data;
}
