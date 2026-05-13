import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES, USER_ROLES } from "@/lib/roles";

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

    const customers = await User.find({
      role: USER_ROLES.CUSTOMER,
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({
          customerId: customer._id,
        }).lean();

        const totalOrders = orders.length;

        const totalSpent = orders
          .filter((order) => order.orderStatus !== "CANCELLED")
          .reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          ...customer,
          totalOrders,
          totalSpent,
        };
      }),
    );

    return successResponse(
      "Customers fetched successfully.",
      customersWithStats,
    );
  } catch (error) {
    console.error("GET_CUSTOMERS_ERROR", error);
    return errorResponse("Failed to fetch customers.", 500);
  }
}
