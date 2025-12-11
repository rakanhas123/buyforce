import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // כתובת ה-API שלך (NestJS)
  withCredentials: true,
});
