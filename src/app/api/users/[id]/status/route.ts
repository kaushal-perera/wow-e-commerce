import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { STAFF_ROLES, USER_ROLES } from "@/lib/roles";
import { updateUserStatusSchema } from "@/validations/userValidation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    if (authUser.role !== USER_ROLES.ADMIN) {
      return errorResponse("Only admin can update staff status.", 403);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid user id.", 400);
    }

    if (authUser.userId === id) {
      return errorResponse("You cannot deactivate your own account.", 400);
    }

    const body = await request.json();
    const result = updateUserStatusSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: {
          $in: STAFF_ROLES,
        },
      },
      {
        status: result.data.status,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return errorResponse("Staff user not found.", 404);
    }

    return successResponse("Staff status updated successfully.", user);
  } catch (error) {
    console.error("UPDATE_STAFF_STATUS_ERROR", error);
    return errorResponse("Failed to update staff status.", 500);
  }
}
