export type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: ProductCategory;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  reorderLevel: number;
  images: string[];
  brand?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductPayload = {
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  reorderLevel: number;
  images?: string[];
  brand?: string;
  isFeatured?: boolean;
  isActive?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getProducts() {
  const response = await fetch("/api/products", {
    cache: "no-store",
  });

  const result: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch products.");
  }

  return result.data;
}

export async function getProductById(id: string) {
  const response = await fetch(`/api/products/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Product> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch product.");
  }

  return result.data;
}

export async function createProduct(payload: ProductPayload) {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Product> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create product.");
  }

  return result.data;
}

export async function updateProduct(id: string, payload: ProductPayload) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Product> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update product.");
  }

  return result.data;
}

export async function deleteProduct(id: string) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  const result: ApiResponse<null> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete product.");
  }

  return result;
}
