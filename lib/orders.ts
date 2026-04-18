// import api from "./api";
// import { ApiResponse, Order, OrderItem, Receipt } from "@/types";

// export const placeOrderApi = async (
//   items: OrderItem[],
// ): Promise<ApiResponse<Order>> => {
//   const res = await api.post("/order", { items });
//   return res.data;
// };

// export const getMyOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
//   const res = await api.get("/order/my-orders");
//   return res.data;
// };

// export const getAllOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
//   const res = await api.get("/order");
//   return res.data;
// };

// export const updateOrderStatusApi = async (
//   id: string,
//   status: "pending" | "completed",
// ): Promise<ApiResponse<Order>> => {
//   const res = await api.patch(`/order/${id}/status`, { status });
//   return res.data;
// };

// export const generateReceiptApi = async (
//   orderId: string,
// ): Promise<ApiResponse<Receipt>> => {
//   const res = await api.post("/receipt", { orderId });
//   return res.data;
// };

// export const getReceiptByOrderApi = async (
//   orderId: string,
// ): Promise<ApiResponse<Receipt>> => {
//   const res = await api.get(`/receipt/${orderId}`);
//   return res.data;
// };

// export const getAllReceiptsApi = async (): Promise<ApiResponse<Receipt[]>> => {
//   const res = await api.get("/receipt");
//   return res.data;
// };

// import api from "./api";
// import { ApiResponse, Order, OrderItem, Receipt } from "@/types";

// export const placeOrderApi = async (
//   items: OrderItem[],
//   orderType: "dine-in" | "take-away",
//   paymentMethod: "upi" | "cash",
// ): Promise<ApiResponse<Order>> => {
//   const res = await api.post("/order", { items, orderType, paymentMethod });
//   return res.data;
// };

// export const getMyOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
//   const res = await api.get("/order/my-orders");
//   return res.data;
// };

// export const getAllOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
//   const res = await api.get("/order");
//   return res.data;
// };

// export const updateOrderStatusApi = async (
//   id: string,
//   status: "pending" | "completed",
// ): Promise<ApiResponse<Order>> => {
//   const res = await api.patch(`/order/${id}/status`, { status });
//   return res.data;
// };

// export const generateReceiptApi = async (
//   orderId: string,
// ): Promise<ApiResponse<Receipt>> => {
//   const res = await api.post("/receipt", { orderId });
//   return res.data;
// };

// export const getReceiptByOrderApi = async (
//   orderId: string,
// ): Promise<ApiResponse<Receipt>> => {
//   const res = await api.get(`/receipt/${orderId}`);
//   return res.data;
// };

// export const getAllReceiptsApi = async (): Promise<ApiResponse<Receipt[]>> => {
//   const res = await api.get("/receipt");
//   return res.data;
// };

import api from "./api";
import { ApiResponse, Order, OrderItem, Receipt } from "@/types";

export const placeOrderApi = async (
  items: OrderItem[],
  orderType: "dine-in" | "take-away",
  paymentMethod: "upi" | "cash",
): Promise<ApiResponse<Order>> => {
  const res = await api.post("/order", { items, orderType, paymentMethod });
  return res.data;
};

export const getMyOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const res = await api.get("/order/my-orders");
  return res.data;
};

export const getAllOrdersApi = async (): Promise<ApiResponse<Order[]>> => {
  const res = await api.get("/order");
  return res.data;
};

export const updateOrderStatusApi = async (
  id: string,
  status: "pending" | "completed",
): Promise<ApiResponse<Order>> => {
  const res = await api.patch(`/order/${id}/status`, { status });
  return res.data;
};

export const generateReceiptApi = async (
  orderId: string,
): Promise<ApiResponse<Receipt>> => {
  const res = await api.post("/receipt", { orderId });
  return res.data;
};

export const getReceiptByOrderApi = async (
  orderId: string,
): Promise<ApiResponse<Receipt>> => {
  const res = await api.get(`/receipt/${orderId}`);
  return res.data;
};

export const getAllReceiptsApi = async (): Promise<ApiResponse<Receipt[]>> => {
  const res = await api.get("/receipt");
  return res.data;
};

export const notifyOrderReadyApi = async (
  orderId: string,
): Promise<ApiResponse> => {
  const res = await api.post(`/order/${orderId}/notify`);
  return res.data;
};
