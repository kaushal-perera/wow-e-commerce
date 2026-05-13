import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import Order from "@/models/Order";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES, USER_ROLES } from "@/lib/roles";
import { createDeliverySchema } from "@/validations/deliveryValidation";
import { generateTrackingNumber } from "@/lib/deliveryUtils";

export const runtime = "nodejs";

async function checkAdminAccess() {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
      response: errorResponse("Unauthorized.", 401),
    };
  }

  if (!ADMIN_ROLES.includes(authUser.role)) {
    return {
      allowed: false,
      response: errorResponse("Forbidden.", 403),
    };
  }

  return {
    allowed: true,
  };
}

export async function GET() {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const deliveries = await Delivery.find()
      .populate({
        path: "orderId",
        select:
          "orderNumber customerId totalAmount orderStatus paymentStatus deliveryAddress createdAt",
        populate: {
          path: "customerId",
          select: "fullName email phone",
        },
      })
      .populate("deliveryStaffId", "fullName email phone role")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("Deliveries fetched successfully.", deliveries);
  } catch (error) {
    console.error("GET_DELIVERIES_ERROR", error);
    return errorResponse("Failed to fetch deliveries.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const body = await request.json();
    const result = createDeliverySchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { orderId, deliveryStaffId, estimatedDeliveryDate, deliveryNotes } =
      result.data;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return errorResponse("Invalid order id.", 400);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return errorResponse("Order not found.", 404);
    }

    if (order.orderStatus === "CANCELLED" || order.orderStatus === "RETURNED") {
      return errorResponse(
        "Cannot create delivery for cancelled or returned order.",
        400,
      );
    }

    const existingDelivery = await Delivery.findOne({ orderId });

    if (existingDelivery) {
      return errorResponse("Delivery already exists for this order.", 409);
    }

    let finalDeliveryStatus: "PENDING" | "ASSIGNED" = "PENDING";

    if (deliveryStaffId) {
      if (!mongoose.Types.ObjectId.isValid(deliveryStaffId)) {
        return errorResponse("Invalid delivery staff id.", 400);
      }

      const staff = await User.findOne({
        _id: deliveryStaffId,
        role: USER_ROLES.DELIVERY_STAFF,
        status: "ACTIVE",
      });

      if (!staff) {
        return errorResponse("Delivery staff not found.", 404);
      }

      finalDeliveryStatus = "ASSIGNED";
    }

    const delivery = await Delivery.create({
      orderId,
      deliveryStaffId: deliveryStaffId || undefined,
      trackingNumber: generateTrackingNumber(),
      deliveryStatus: finalDeliveryStatus,
      estimatedDeliveryDate: estimatedDeliveryDate
        ? new Date(estimatedDeliveryDate)
        : undefined,
      deliveryNotes,
    });

    if (order.orderStatus === "CONFIRMED") {
      order.orderStatus = "PROCESSING";
      await order.save();
    }

    const createdDelivery = await Delivery.findById(delivery._id)
      .populate({
        path: "orderId",
        select:
          "orderNumber customerId totalAmount orderStatus paymentStatus deliveryAddress createdAt",
        populate: {
          path: "customerId",
          select: "fullName email phone",
        },
      })
      .populate("deliveryStaffId", "fullName email phone role");

    return successResponse(
      "Delivery created successfully.",
      createdDelivery,
      201,
    );
  } catch (error) {
    console.error("CREATE_DELIVERY_ERROR", error);
    return errorResponse("Failed to create delivery.", 500);
  }
}
