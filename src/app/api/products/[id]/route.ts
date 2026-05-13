import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { generateSlug } from "@/lib/slug";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { updateProductSchema } from "@/validations/productValidation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid product id.", 400);
    }

    const product = await Product.findById(id).populate(
      "categoryId",
      "name slug",
    );

    if (!product) {
      return errorResponse("Product not found.", 404);
    }

    return successResponse("Product fetched successfully.", product);
  } catch (error) {
    console.error("GET_PRODUCT_ERROR", error);
    return errorResponse("Failed to fetch product.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid product id.", 400);
    }

    const body = await request.json();
    const result = updateProductSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return errorResponse("Product not found.", 404);
    }

    const updateData: Record<string, unknown> = {
      ...result.data,
    };

    if (result.data.categoryId) {
      if (!mongoose.Types.ObjectId.isValid(result.data.categoryId)) {
        return errorResponse("Invalid category id.", 400);
      }

      const category = await Category.findById(result.data.categoryId);

      if (!category) {
        return errorResponse("Category not found.", 404);
      }
    }

    if (result.data.name) {
      const slug = generateSlug(result.data.name);
      updateData.slug = slug;

      const duplicateSlug = await Product.findOne({
        _id: { $ne: id },
        slug,
      });

      if (duplicateSlug) {
        return errorResponse("Another product already uses this name.", 409);
      }
    }

    if (result.data.sku) {
      const duplicateSku = await Product.findOne({
        _id: { $ne: id },
        sku: result.data.sku.toUpperCase(),
      });

      if (duplicateSku) {
        return errorResponse("Another product already uses this SKU.", 409);
      }

      updateData.sku = result.data.sku.toUpperCase();
    }

    const finalPrice = result.data.price ?? existingProduct.price;
    const finalDiscountPrice =
      result.data.discountPrice ?? existingProduct.discountPrice;

    if (finalDiscountPrice && finalDiscountPrice > finalPrice) {
      return errorResponse("Discount price cannot be greater than price.", 400);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("categoryId", "name slug");

    return successResponse("Product updated successfully.", product);
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return errorResponse("Failed to update product.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid product id.", 400);
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return errorResponse("Product not found.", 404);
    }

    return successResponse("Product deleted successfully.");
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error);
    return errorResponse("Failed to delete product.", 500);
  }
}
