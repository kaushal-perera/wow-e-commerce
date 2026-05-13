import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES, USER_ROLES } from "@/lib/roles";

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

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid customer id.", 400);
    }

    const customer = await User.findOne({
      _id: id,
      role: USER_ROLES.CUSTOMER,
    })
      .select("-password")
      .lean();

    if (!customer) {
      return errorResponse("Customer not found.", 404);
    }

    const orders = await Order.find({
      customerId: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalOrders = orders.length;

    const totalSpent = orders
      .filter((order) => order.orderStatus !== "CANCELLED")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return successResponse("Customer fetched successfully.", {
      customer,
      orders,
      totalOrders,
      totalSpent,
    });
  } catch (error) {
    console.error("GET_CUSTOMER_ERROR", error);
    return errorResponse("Failed to fetch customer.", 500);
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
      return errorResponse("Invalid customer id.", 400);
    }

    const body = await request.json();

    if (!["ACTIVE", "INACTIVE"].includes(body.status)) {
      return errorResponse("Invalid customer status.", 400);
    }

    const customer = await User.findOneAndUpdate(
      {
        _id: id,
        role: USER_ROLES.CUSTOMER,
      },
      {
        status: body.status,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!customer) {
      return errorResponse("Customer not found.", 404);
    }

    return successResponse("Customer status updated successfully.", customer);
  } catch (error) {
    console.error("UPDATE_CUSTOMER_STATUS_ERROR", error);
    return errorResponse("Failed to update customer status.", 500);
  }
}
