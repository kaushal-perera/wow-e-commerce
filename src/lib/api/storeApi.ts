import { Product } from "./productsApi";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ProductDetailsResponse = {
  product: Product;
  relatedProducts: Product[];
};

export async function getStoreProducts() {
  const response = await fetch("/api/store/products", {
    cache: "no-store",
  });

  const result: ApiResponse<Product[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch products.");
  }

  return result.data;
}

export async function getStoreProductBySlug(slug: string) {
  const response = await fetch(`/api/store/products/${slug}`, {
    cache: "no-store",
  });

  const result: ApiResponse<ProductDetailsResponse> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch product.");
  }

  return result.data;
}
