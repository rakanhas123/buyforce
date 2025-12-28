import axios from "./axiosClient";

export const getGroupById = async (groupId: string, token: string) => {
  const res = await axios.get(`/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.group;
};

export const payForProduct = async (groupId: string, token: string) => {
  const res = await axios.post(
    `/groups/${groupId}/pay-product`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
