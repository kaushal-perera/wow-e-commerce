import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { createCategorySchema } from "@/validations/categoryValidation";
import { generateSlug } from "@/lib/slug";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return successResponse("Categories fetched successfully.", categories);
  } catch (error) {
    console.error("GET_CATEGORIES_ERROR", error);
    return errorResponse("Failed to fetch categories.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (!ADMIN_ROLES.includes(authUser.role)) {
      return errorResponse("Forbidden.", 403);
    }

    const body = await request.json();
    const result = createCategorySchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { name, description, image, isActive } = result.data;

    const slug = generateSlug(name);

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return errorResponse("Category already exists.", 409);
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive: isActive ?? true,
    });

    return successResponse("Category created successfully.", category, 201);
  } catch (error) {
    console.error("CREATE_CATEGORY_ERROR", error);
    return errorResponse("Failed to create category.", 500);
  }
}
