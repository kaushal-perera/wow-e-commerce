import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { generateSlug } from "@/lib/slug";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";
import { createProductSchema } from "@/validations/productValidation";

export const runtime = "nodejs";

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

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("Products fetched successfully.", products);
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return errorResponse("Failed to fetch products.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const access = await checkAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const {
      name,
      description,
      categoryId,
      price,
      discountPrice,
      sku,
      stockQuantity,
      reorderLevel,
      images,
      brand,
      isFeatured,
      isActive,
    } = result.data;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return errorResponse("Invalid category id.", 400);
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return errorResponse("Category not found.", 404);
    }

    const slug = generateSlug(name);

    const existingProduct = await Product.findOne({
      $or: [{ slug }, { sku: sku.toUpperCase() }],
    });

    if (existingProduct) {
      return errorResponse("Product name or SKU already exists.", 409);
    }

    if (discountPrice && discountPrice > price) {
      return errorResponse("Discount price cannot be greater than price.", 400);
    }

    const product = await Product.create({
      name,
      slug,
      description,
      categoryId,
      price,
      discountPrice: discountPrice ?? 0,
      sku: sku.toUpperCase(),
      stockQuantity,
      reorderLevel,
      images: images ?? [],
      brand,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
    });

    const createdProduct = await Product.findById(product._id).populate(
      "categoryId",
      "name slug",
    );

    return successResponse(
      "Product created successfully.",
      createdProduct,
      201,
    );
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return errorResponse("Failed to create product.", 500);
  }
}
