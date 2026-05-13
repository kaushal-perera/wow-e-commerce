import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
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

    const deliveryStaff = await User.find({
      role: USER_ROLES.DELIVERY_STAFF,
      status: "ACTIVE",
    })
      .select("-password")
      .sort({ fullName: 1 })
      .lean();

    return successResponse(
      "Delivery staff fetched successfully.",
      deliveryStaff,
    );
  } catch (error) {
    console.error("GET_DELIVERY_STAFF_ERROR", error);
    return errorResponse("Failed to fetch delivery staff.", 500);
  }
}
