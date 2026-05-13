import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const products = await Product.find({
      $expr: {
        $lte: ["$stockQuantity", "$reorderLevel"],
      },
    })
      .populate("categoryId", "name slug")
      .sort({ stockQuantity: 1 })
      .lean();

    return successResponse(
      "Low-stock products fetched successfully.",
      products,
    );
  } catch (error) {
    console.error("GET_LOW_STOCK_ERROR", error);
    return errorResponse("Failed to fetch low-stock products.", 500);
  }
}
