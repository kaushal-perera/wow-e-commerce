import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { USER_ROLES } from "@/lib/roles";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (authUser.role !== USER_ROLES.CUSTOMER) {
      return errorResponse("Only customers can view their orders.", 403);
    }

    const orders = await Order.find({
      customerId: authUser.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("My orders fetched successfully.", orders);
  } catch (error) {
    console.error("GET_MY_ORDERS_ERROR", error);
    return errorResponse("Failed to fetch my orders.", 500);
  }
}
