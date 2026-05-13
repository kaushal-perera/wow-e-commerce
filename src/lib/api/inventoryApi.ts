import { Product } from "./productsApi";

export type InventoryMovementType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "MANUAL_ADJUSTMENT"
  | "ORDER_DEDUCTION"
  | "ORDER_CANCEL_RESTORE"
  | "RETURN_RESTORE";

export type InventoryMovement = {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    images?: string[];
    stockQuantity?: number;
  };
  previousQuantity: number;
  changedQuantity: number;
  newQuantity: number;
  movementType: InventoryMovementType;
  reason?: string;
  updatedBy?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateStockPayload = {
  productId: string;
  movementType: "STOCK_IN" | "STOCK_OUT" | "MANUAL_ADJUSTMENT";
  quantity: number;
  reason?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getInventoryProducts() {
  const response = await fetch("/api/inventory", {
    cache: "no-store",
  });

  const result: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch inventory.");
  }

  return result.data;
}

export async function getLowStockProducts() {
  const response = await fetch("/api/inventory/low-stock", {
    cache: "no-store",
  });

  const result: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch low-stock products.");
  }

  return result.data;
}

export async function getInventoryMovements() {
  const response = await fetch("/api/inventory/movements", {
    cache: "no-store",
  });

  const result: ApiResponse<InventoryMovement[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch inventory movements.");
  }

  return result.data;
}

export async function updateStock(payload: UpdateStockPayload) {
  const response = await fetch("/api/inventory/update-stock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<{
    product: Product;
    movement: InventoryMovement;
  }> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update stock.");
  }

  return result.data;
}
