import http from "./http";

export async function createCheckout(groupId: string): Promise<string> {
  const { data } = await http.post("/v1/payments/checkout", { groupId });
  return data.url as string;
}

export async function markPaid(groupId: string) {
  const { data } = await http.post("/v1/payments/mark-paid", { groupId });
  return data;
}
