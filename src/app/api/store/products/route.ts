import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
    })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("Products fetched successfully.", products);
  } catch (error) {
    console.error("GET_STORE_PRODUCTS_ERROR", error);
    return errorResponse("Failed to fetch products.", 500);
  }
}
