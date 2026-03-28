import api from "./api";
import { ApiResponse, MenuItem } from "@/types";

export const getMenuApi = async (): Promise<ApiResponse<MenuItem[]>> => {
  const res = await api.get("/menu");
  return res.data;
};

export const createMenuApi = async (data: {
  name: string;
  price: number;
  category: string;
  isAvailable?: boolean;
}): Promise<ApiResponse<MenuItem>> => {
  const res = await api.post("/menu", data);
  return res.data;
};

export const updateMenuApi = async (
  id: string,
  data: Partial<{
    name: string;
    price: number;
    category: string;
    isAvailable: boolean;
  }>,
): Promise<ApiResponse<MenuItem>> => {
  const res = await api.put(`/menu/${id}`, data);
  return res.data;
};

export const deleteMenuApi = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete(`/menu/${id}`);
  return res.data;
};
