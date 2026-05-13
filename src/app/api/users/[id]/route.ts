import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { STAFF_ROLES, USER_ROLES } from "@/lib/roles";
import { updateStaffUserSchema } from "@/validations/userValidation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

async function checkSuperAdminAccess() {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
      authUser: null,
      response: errorResponse("Unauthorized.", 401),
    };
  }

  if (authUser.role !== USER_ROLES.ADMIN) {
    return {
      allowed: false,
      authUser,
      response: errorResponse("Only admin can manage staff users.", 403),
    };
  }

  return {
    allowed: true,
    authUser,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkSuperAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid user id.", 400);
    }

    const user = await User.findOne({
      _id: id,
      role: {
        $in: STAFF_ROLES,
      },
    }).select("-password");

    if (!user) {
      return errorResponse("Staff user not found.", 404);
    }

    return successResponse("Staff user fetched successfully.", user);
  } catch (error) {
    console.error("GET_STAFF_USER_ERROR", error);
    return errorResponse("Failed to fetch staff user.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const access = await checkSuperAdminAccess();

    if (!access.allowed || !access.authUser) {
      return access.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("Invalid user id.", 400);
    }

    if (access.authUser.userId === id) {
      return errorResponse(
        "You cannot update your own role or status here.",
        400,
      );
    }

    const body = await request.json();
    const result = updateStaffUserSchema.safeParse(body);

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
      result.data,
      {
        new: true,
      },
    ).select("-password");

    if (!user) {
      return errorResponse("Staff user not found.", 404);
    }

    return successResponse("Staff user updated successfully.", user);
  } catch (error) {
    console.error("UPDATE_STAFF_USER_ERROR", error);
    return errorResponse("Failed to update staff user.", 500);
  }
}
