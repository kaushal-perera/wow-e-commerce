export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "ONLINE";

export type OrderCustomer = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
};

export type OrderItem = {
  productId:
    | string
    | {
        _id: string;
        name: string;
        sku: string;
        images?: string[];
        stockQuantity?: number;
      };
  productName: string;
  productSku: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customerId: string | OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode?: string;
  };
  notes?: string;
  stockDeducted: boolean;
  confirmedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderPayload = {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryFee?: number;
  discount?: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode?: string;
  };
  notes?: string;
};

export type UpdateOrderPayload = {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getOrders() {
  const response = await fetch("/api/orders", {
    cache: "no-store",
  });

  const result: ApiResponse<Order[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch orders.");
  }

  return result.data;
}

export async function getOrderById(id: string) {
  const response = await fetch(`/api/orders/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Order> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch order.");
  }

  return result.data;
}

export async function updateOrder(id: string, payload: UpdateOrderPayload) {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Order> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update order.");
  }

  return result.data;
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Order> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create order.");
  }

  return result.data;
}

export async function getMyOrders() {
  const response = await fetch("/api/orders/my-orders", {
    cache: "no-store",
  });

  const result: ApiResponse<Order[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch my orders.");
  }

  return result.data;
}
