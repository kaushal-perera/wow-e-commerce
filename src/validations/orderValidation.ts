import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Order must have at least one product"),

  deliveryFee: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional(),

  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "ONLINE"]).default("COD"),

  deliveryAddress: z.object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().min(5, "Phone number is required"),
    line1: z.string().min(2, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().optional(),
  }),

  notes: z.string().optional(),
});

export const updateOrderSchema = z.object({
  orderStatus: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
      "DISPATCHED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ])
    .optional(),

  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),

  notes: z.string().optional(),
});
