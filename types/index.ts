export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
  createdAt?: string;
}

export interface OrderItem {
  menuId: string;
  quantity: number;
}

export interface OrderItemResponse {
  menuId: string;
  menuName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItemResponse[];
  totalAmount: number;
  status: "pending" | "completed";
  createdAt: string;
}

export interface ReceiptItem {
  menuId: string;
  menuName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Receipt {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: ReceiptItem[];
  totalAmount: number;
  generatedAt: string;
}
