import { z } from "zod";

export const createStaffUserSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "INVENTORY_MANAGER", "SALES_STAFF", "DELIVERY_STAFF"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateStaffUserSchema = z.object({
  fullName: z.string().min(2, "Full name is required").optional(),
  phone: z.string().optional(),
  role: z
    .enum(["ADMIN", "INVENTORY_MANAGER", "SALES_STAFF", "DELIVERY_STAFF"])
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
