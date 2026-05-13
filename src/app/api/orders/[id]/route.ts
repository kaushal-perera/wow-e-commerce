import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import InventoryMovement from "@/models/InventoryMovement";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { updateOrderSchema } from "@/validations/orderValidation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type AdminAccessResult =
  | {
      allowed: true;
      authUser: {
        userId: string;
        role: string;
        email?: string;
        fullName?: string;
      };
      response?: never;
    }
  | {
      allowed: false;
      authUser?: null;
      response: NextResponse;
    };

async function checkAdminAccess(): Promise<AdminAccessResult> {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
      authUser: null,
      response: errorResponse("Unauthorized.", 401),
    };
  }

  if (!ADMIN_ROLES.includes(authUser.role as any)) {
    return {
      allowed: false,
      response: errorResponse("Forbidden.", 403),
    };
  }

  return {
    allowed: true,
    authUser,
  };
}

async function deductStockForOrder(order: any, userId: string) {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productName}`);
    }

    if (product.stockQuantity < item.quantity) {
      throw new Error(
        `Not enough stock for ${product.name}. Available stock: ${product.stockQuantity}`,
      );
    }

    const previousQuantity = product.stockQuantity;
    const newQuantity = previousQuantity - item.quantity;

    product.stockQuantity = newQuantity;
    await product.save();

    await InventoryMovement.create({
      productId: product._id,
      previousQuantity,
      changedQuantity: -item.quantity,
      newQuantity,
      movementType: "ORDER_DEDUCTION",
      reason: `Stock deducted for order ${order.orderNumber}`,
      updatedBy: userId,
    });
  }

  order.stockDeducted = true;
  order.confirmedAt = new Date();
}

async function restoreStockForOrder(order: any, userId: string) {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      continue;
    }

    const previousQuantity = product.stockQuantity;
    const newQuantity = previousQuantity + item.quantity;

    product.stockQuantity = newQuantity;
    await product.save();

    await InventoryMovement.create({
      productId: product._id,
      previousQuantity,
      changedQuantity: item.quantity,
      newQuantity,
      movementType:
        order.orderStatus === "RETURNED"
          ? "RETURN_RESTORE"
          : "ORDER_CANCEL_RESTORE",
      reason: `Stock restored for order ${order.orderNumber}`,
      updatedBy: userId,
    });
  }

  order.stockDeducted = false;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid order id.", 400);
    }

    const order = await Order.findById(id)
      .populate("customerId", "fullName email phone")
      .populate("items.productId", "name sku images stockQuantity")
      .lean();

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    return successResponse("Order fetched successfully.", order);
  } catch (error) {
    console.error("GET_ORDER_ERROR", error);
    return errorResponse("Failed to fetch order.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid order id.", 400);
    }

    const body = await request.json();
    const result = updateOrderSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    const newOrderStatus = result.data.orderStatus;
    const newPaymentStatus = result.data.paymentStatus;

    if (newOrderStatus) {
      if (order.orderStatus === "DELIVERED") {
        return errorResponse("Delivered orders cannot be changed.", 400);
      }

      if (newOrderStatus === "CONFIRMED" && !order.stockDeducted) {
        await deductStockForOrder(order, access.authUser.userId);
      }

      if (
        (newOrderStatus === "CANCELLED" || newOrderStatus === "RETURNED") &&
        order.stockDeducted
      ) {
        order.orderStatus = newOrderStatus;
        await restoreStockForOrder(order, access.authUser.userId);
      }

      order.orderStatus = newOrderStatus;

      if (newOrderStatus === "DELIVERED") {
        order.deliveredAt = new Date();
      }

      if (newOrderStatus === "CANCELLED") {
        order.cancelledAt = new Date();
      }
    }

    if (newPaymentStatus) {
      order.paymentStatus = newPaymentStatus;
    }

    if (typeof result.data.notes === "string") {
      order.notes = result.data.notes;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("customerId", "fullName email phone")
      .populate("items.productId", "name sku images stockQuantity");

    return successResponse("Order updated successfully.", updatedOrder);
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR", error);

    return errorResponse(
      error instanceof Error ? error.message : "Failed to update order.",
      500,
    );
  }
}
