import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES, USER_ROLES } from "@/lib/roles";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { createOrderSchema } from "@/validations/orderValidation";
import { generateOrderNumber } from "@/lib/orderUtils";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (!ADMIN_ROLES.includes(authUser.role)) {
      return errorResponse("Forbidden.", 403);
    }

    const orders = await Order.find()
      .populate("customerId", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("Orders fetched successfully.", orders);
  } catch (error) {
    console.error("GET_ORDERS_ERROR", error);
    return errorResponse("Failed to fetch orders.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (authUser.role !== USER_ROLES.CUSTOMER) {
      return errorResponse("Only customers can place orders.", 403);
    }

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const {
      items,
      deliveryFee = 0,
      discount = 0,
      paymentMethod,
      deliveryAddress,
      notes,
    } = result.data;

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return errorResponse("Invalid product id.", 400);
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return errorResponse("Product not found.", 404);
      }

      if (!product.isActive) {
        return errorResponse(`${product.name} is not available.`, 400);
      }

      if (item.quantity > product.stockQuantity) {
        return errorResponse(
          `Only ${product.stockQuantity} items available for ${product.name}.`,
          400,
        );
      }

      const sellingPrice =
        product.discountPrice && product.discountPrice > 0
          ? product.discountPrice
          : product.price;

      const total = sellingPrice * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productSku: product.sku,
        productImage: product.images?.[0] || "",
        quantity: item.quantity,
        price: sellingPrice,
        total,
      });
    }

    const totalAmount = subtotal + deliveryFee - discount;

    if (totalAmount < 0) {
      return errorResponse("Total amount cannot be negative.", 400);
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerId: authUser.userId,
      items: orderItems,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      deliveryAddress,
      notes,
      stockDeducted: false,
    });

    const createdOrder = await Order.findById(order._id).populate(
      "customerId",
      "fullName email phone",
    );

    return successResponse("Order placed successfully.", createdOrder, 201);
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    return errorResponse("Failed to create order.", 500);
  }
}
