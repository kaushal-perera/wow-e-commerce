import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({
      slug,
      isActive: true,
    }).populate("categoryId", "name slug");

    if (!product) {
      return errorResponse("Product not found.", 404);
    }

    const relatedProducts = await Product.find({
      _id: {
        $ne: product._id,
      },
      categoryId: product.categoryId,
      isActive: true,
    })
      .limit(4)
      .populate("categoryId", "name slug")
      .lean();

    return successResponse("Product fetched successfully.", {
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("GET_STORE_PRODUCT_ERROR", error);
    return errorResponse("Failed to fetch product.", 500);
  }
}
