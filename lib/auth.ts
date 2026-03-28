import api from "./api";
import { ApiResponse, User } from "@/types";

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<ApiResponse<User>> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<ApiResponse<User>> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logoutApi = async (): Promise<ApiResponse> => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getProfileApi = async (): Promise<ApiResponse<User>> => {
  const res = await api.get("/user/profile");
  return res.data;
};
