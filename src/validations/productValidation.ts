import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be valid"),
  discountPrice: z.coerce.number().min(0).optional(),
  sku: z.string().min(2, "SKU is required"),
  stockQuantity: z.coerce.number().min(0, "Stock quantity must be valid"),
  reorderLevel: z.coerce.number().min(0, "Reorder level must be valid"),
  images: z.array(z.string()).optional(),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
