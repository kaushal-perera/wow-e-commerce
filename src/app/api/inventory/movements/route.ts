import { connectDB } from "@/lib/mongodb";
import InventoryMovement from "@/models/InventoryMovement";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";

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

    const movements = await InventoryMovement.find()
      .populate("productId", "name sku images stockQuantity")
      .populate("updatedBy", "fullName email role")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(
      "Inventory movements fetched successfully.",
      movements,
    );
  } catch (error) {
    console.error("GET_INVENTORY_MOVEMENTS_ERROR", error);
    return errorResponse("Failed to fetch inventory movements.", 500);
  }
}
