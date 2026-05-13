import { z } from "zod";

export const updateStockSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  movementType: z.enum(["STOCK_IN", "STOCK_OUT", "MANUAL_ADJUSTMENT"]),
  quantity: z.coerce.number().min(0, "Quantity must be valid"),
  reason: z.string().optional(),
});
