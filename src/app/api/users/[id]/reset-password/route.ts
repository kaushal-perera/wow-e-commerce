import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { STAFF_ROLES, USER_ROLES } from "@/lib/roles";
import { resetPasswordSchema } from "@/validations/userValidation";

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
      return errorResponse("Only admin can reset staff passwords.", 403);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid user id.", 400);
    }

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: {
          $in: STAFF_ROLES,
        },
      },
      {
        password: hashedPassword,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return errorResponse("Staff user not found.", 404);
    }

    return successResponse("Password reset successfully.", user);
  } catch (error) {
    console.error("RESET_STAFF_PASSWORD_ERROR", error);
    return errorResponse("Failed to reset password.", 500);
  }
}
