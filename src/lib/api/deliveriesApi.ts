import { Order } from "./ordersApi";
import { Customer } from "./customersApi";

export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

export type DeliveryStaff = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
};

export type DeliveryOrder = Omit<Order, "customerId"> & {
  customerId: Customer;
};

export type Delivery = {
  _id: string;
  orderId: DeliveryOrder;
  deliveryStaffId?: DeliveryStaff;
  trackingNumber: string;
  deliveryStatus: DeliveryStatus;
  estimatedDeliveryDate?: string;
  pickedUpDate?: string;
  deliveredDate?: string;
  failedDate?: string;
  returnedDate?: string;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDeliveryPayload = {
  orderId: string;
  deliveryStaffId?: string | null;
  estimatedDeliveryDate?: string;
  deliveryNotes?: string;
};

export type UpdateDeliveryPayload = {
  deliveryStaffId?: string | null;
  deliveryStatus?: DeliveryStatus;
  estimatedDeliveryDate?: string;
  deliveryNotes?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getDeliveries() {
  const response = await fetch("/api/deliveries", {
    cache: "no-store",
  });

  const result: ApiResponse<Delivery[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch deliveries.");
  }

  return result.data;
}

export async function getDeliveryById(id: string) {
  const response = await fetch(`/api/deliveries/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Delivery> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch delivery.");
  }

  return result.data;
}

export async function createDelivery(payload: CreateDeliveryPayload) {
  const response = await fetch("/api/deliveries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Delivery> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create delivery.");
  }

  return result.data;
}

export async function updateDelivery(
  id: string,
  payload: UpdateDeliveryPayload,
) {
  const response = await fetch(`/api/deliveries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Delivery> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update delivery.");
  }

  return result.data;
}

export async function getDeliveryStaff() {
  const response = await fetch("/api/users/delivery-staff", {
    cache: "no-store",
  });

  const result: ApiResponse<DeliveryStaff[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch delivery staff.");
  }

  return result.data;
}
