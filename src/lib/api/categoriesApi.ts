export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CategoryPayload = {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export async function getCategories() {
  const response = await fetch("/api/categories", {
    cache: "no-store",
  });

  const result: ApiResponse<Category[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch categories.");
  }

  return result.data;
}

export async function getCategoryById(id: string) {
  const response = await fetch(`/api/categories/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch category.");
  }

  return result.data;
}

export async function createCategory(payload: CategoryPayload) {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create category.");
  }

  return result.data;
}

export async function updateCategory(id: string, payload: CategoryPayload) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Category> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update category.");
  }

  return result.data;
}

export async function deleteCategory(id: string) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });

  const result: ApiResponse<null> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete category.");
  }

  return result;
}
