export type StaffRole =
  | "ADMIN"
  | "INVENTORY_MANAGER"
  | "SALES_STAFF"
  | "DELIVERY_STAFF";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type StaffUser = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffUserPayload = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: StaffRole;
  status?: UserStatus;
};

export type UpdateStaffUserPayload = {
  fullName?: string;
  phone?: string;
  role?: StaffRole;
  status?: UserStatus;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getStaffUsers() {
  const response = await fetch("/api/users", {
    cache: "no-store",
  });

  const result: ApiResponse<StaffUser[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch staff users.");
  }

  return result.data;
}

export async function getStaffUserById(id: string) {
  const response = await fetch(`/api/users/${id}`, {
    cache: "no-store",
  });

  const result: ApiResponse<StaffUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch staff user.");
  }

  return result.data;
}

export async function createStaffUser(payload: CreateStaffUserPayload) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<StaffUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create staff user.");
  }

  return result.data;
}

export async function updateStaffUser(
  id: string,
  payload: UpdateStaffUserPayload,
) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<StaffUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update staff user.");
  }

  return result.data;
}

export async function updateStaffUserStatus(id: string, status: UserStatus) {
  const response = await fetch(`/api/users/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  const result: ApiResponse<StaffUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update staff status.");
  }

  return result.data;
}

export async function resetStaffUserPassword(id: string, password: string) {
  const response = await fetch(`/api/users/${id}/reset-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
    }),
  });

  const result: ApiResponse<StaffUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to reset password.");
  }

  return result.data;
}
