import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryMovement from "@/models/InventoryMovement";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { updateStockSchema } from "@/validations/inventoryValidation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (!ADMIN_ROLES.includes(authUser.role)) {
      return errorResponse("Forbidden.", 403);
    }

    const body = await request.json();
    const result = updateStockSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { productId, movementType, quantity, reason } = result.data;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("Invalid product id.", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse("Product not found.", 404);
    }

    const previousQuantity = product.stockQuantity;
    let newQuantity = previousQuantity;
    let changedQuantity = 0;

    if (movementType === "STOCK_IN") {
      newQuantity = previousQuantity + quantity;
      changedQuantity = quantity;
    }

    if (movementType === "STOCK_OUT") {
      if (quantity > previousQuantity) {
        return errorResponse(
          "Stock out quantity cannot exceed current stock.",
          400,
        );
      }

      newQuantity = previousQuantity - quantity;
      changedQuantity = -quantity;
    }

    if (movementType === "MANUAL_ADJUSTMENT") {
      newQuantity = quantity;
      changedQuantity = quantity - previousQuantity;
    }

    product.stockQuantity = newQuantity;
    await product.save();

    const movement = await InventoryMovement.create({
      productId: product._id,
      previousQuantity,
      changedQuantity,
      newQuantity,
      movementType,
      reason,
      updatedBy: authUser.userId,
    });

    const updatedProduct = await Product.findById(product._id).populate(
      "categoryId",
      "name slug",
    );

    return successResponse("Stock updated successfully.", {
      product: updatedProduct,
      movement,
    });
  } catch (error) {
    console.error("UPDATE_STOCK_ERROR", error);
    return errorResponse("Failed to update stock.", 500);
  }
}
