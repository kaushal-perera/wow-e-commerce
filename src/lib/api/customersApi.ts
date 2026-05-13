import { Order } from "./ordersApi";

export type CustomerStatus = "ACTIVE" | "INACTIVE";

export type Customer = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: CustomerStatus;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
  };
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  updatedAt: string;
};

export type CustomerDetails = {
  customer: Customer;
  orders: Order[];
  totalOrders: number;
  totalSpent: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getCustomers() {
  const response = await fetch("/api/customers", {
    cache: "no-store",
  });

  const result: ApiResponse<Customer[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch customers.");
  }

  return result.data;
}

export async function getCustomerById(id: string) {
  const response = await fetch(`/api/customers/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<CustomerDetails> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch customer.");
  }

  return result.data;
}

export async function updateCustomerStatus(id: string, status: CustomerStatus) {
  const response = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  const result: ApiResponse<Customer> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update customer status.");
  }

  return result.data;
}
