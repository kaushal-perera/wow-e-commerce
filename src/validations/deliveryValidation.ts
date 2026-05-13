import { z } from "zod";

export const createDeliverySchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  deliveryStaffId: z.string().optional().nullable(),
  estimatedDeliveryDate: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

export const updateDeliverySchema = z.object({
  deliveryStaffId: z.string().optional().nullable(),

  deliveryStatus: z
    .enum([
      "PENDING",
      "ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "FAILED",
      "RETURNED",
    ])
    .optional(),

  estimatedDeliveryDate: z.string().optional(),
  deliveryNotes: z.string().optional(),
});
