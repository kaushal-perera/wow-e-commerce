import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import Order from "@/models/Order";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES, USER_ROLES } from "@/lib/roles";
import { updateDeliverySchema } from "@/validations/deliveryValidation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type AdminAccessResult =
  | {
      allowed: true;
      response?: never;
    }
  | {
      allowed: false;
      response: NextResponse;
    };

async function checkAdminAccess(): Promise<AdminAccessResult> {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
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
  };
}

async function getPopulatedDelivery(id: string) {
  return Delivery.findById(id)
    .populate({
      path: "orderId",
      select:
        "orderNumber customerId items totalAmount orderStatus paymentStatus deliveryAddress createdAt",
      populate: {
        path: "customerId",
        select: "fullName email phone",
      },
    })
    .populate("deliveryStaffId", "fullName email phone role");
}

function mapDeliveryStatusToOrderStatus(deliveryStatus: string) {
  switch (deliveryStatus) {
    case "PICKED_UP":
      return "PACKED";
    case "IN_TRANSIT":
      return "DISPATCHED";
    case "DELIVERED":
      return "DELIVERED";
    case "RETURNED":
      return "RETURNED";
    default:
      return null;
  }
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
      return errorResponse("Invalid delivery id.", 400);
    }

    const delivery = await getPopulatedDelivery(id);

    if (!delivery) {
      return errorResponse("Delivery not found.", 404);
    }

    return successResponse("Delivery fetched successfully.", delivery);
  } catch (error) {
    console.error("GET_DELIVERY_ERROR", error);
    return errorResponse("Failed to fetch delivery.", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid delivery id.", 400);
    }

    const body = await request.json();
    const result = updateDeliverySchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return errorResponse("Delivery not found.", 404);
    }

    const {
      deliveryStaffId,
      deliveryStatus,
      estimatedDeliveryDate,
      deliveryNotes,
    } = result.data;

    if (deliveryStaffId !== undefined) {
      if (deliveryStaffId === null || deliveryStaffId === "") {
        delivery.deliveryStaffId = undefined;
      } else {
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

        delivery.deliveryStaffId = staff._id;

        if (delivery.deliveryStatus === "PENDING") {
          delivery.deliveryStatus = "ASSIGNED";
        }
      }
    }

    if (deliveryStatus) {
      delivery.deliveryStatus = deliveryStatus;

      if (deliveryStatus === "PICKED_UP") {
        delivery.pickedUpDate = new Date();
      }

      if (deliveryStatus === "DELIVERED") {
        delivery.deliveredDate = new Date();
      }

      if (deliveryStatus === "FAILED") {
        delivery.failedDate = new Date();
      }

      if (deliveryStatus === "RETURNED") {
        delivery.returnedDate = new Date();
      }

      const mappedOrderStatus = mapDeliveryStatusToOrderStatus(deliveryStatus);

      if (mappedOrderStatus) {
        const order = await Order.findById(delivery.orderId);

        if (order) {
          order.orderStatus = mappedOrderStatus as any;

          if (mappedOrderStatus === "DELIVERED") {
            order.deliveredAt = new Date();

            if (order.paymentMethod === "COD") {
              order.paymentStatus = "PAID";
            }
          }

          await order.save();
        }
      }
    }

    if (estimatedDeliveryDate !== undefined) {
      delivery.estimatedDeliveryDate = estimatedDeliveryDate
        ? new Date(estimatedDeliveryDate)
        : undefined;
    }

    if (deliveryNotes !== undefined) {
      delivery.deliveryNotes = deliveryNotes;
    }

    await delivery.save();

    const updatedDelivery = await getPopulatedDelivery(id);

    return successResponse("Delivery updated successfully.", updatedDelivery);
  } catch (error) {
    console.error("UPDATE_DELIVERY_ERROR", error);
    return errorResponse("Failed to update delivery.", 500);
  }
}
