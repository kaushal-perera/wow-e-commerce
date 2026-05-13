import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { updateCategorySchema } from "@/validations/categoryValidation";
import { generateSlug } from "@/lib/slug";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type AdminAccessResult =
  | {
      allowed: true;
      response?: never;
    }
  | {
      allowed: false;
      response: NextResponse;
    };

async function checkAdminAccess(): Promise<AdminAccessResult> {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
      response: errorResponse("Unauthorized.", 401),
    };
  }

  if (!ADMIN_ROLES.includes(authUser.role as any)) {
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
      return errorResponse("Invalid category id.", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse("Category not found.", 404);
    }

    return successResponse("Category fetched successfully.", category);
  } catch (error) {
    console.error("GET_CATEGORY_ERROR", error);
    return errorResponse("Failed to fetch category.", 500);
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
      return errorResponse("Invalid category id.", 400);
    }

    const body = await request.json();
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const updateData: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
      isActive?: boolean;
    } = {
      ...result.data,
    };

    if (result.data.name) {
      updateData.slug = generateSlug(result.data.name);

      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [{ name: result.data.name }, { slug: updateData.slug }],
      });

      if (existingCategory) {
        return errorResponse("Another category already uses this name.", 409);
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      return errorResponse("Category not found.", 404);
    }

    return successResponse("Category updated successfully.", category);
  } catch (error) {
    console.error("UPDATE_CATEGORY_ERROR", error);
    return errorResponse("Failed to update category.", 500);
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
      return errorResponse("Invalid category id.", 400);
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return errorResponse("Category not found.", 404);
    }

    return successResponse("Category deleted successfully.");
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR", error);
    return errorResponse("Failed to delete category.", 500);
  }
}
