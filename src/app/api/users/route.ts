import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { STAFF_ROLES, USER_ROLES } from "@/lib/roles";
import { createStaffUserSchema } from "@/validations/userValidation";

export const runtime = "nodejs";

async function checkSuperAdminAccess() {
  const authUser = await getCurrentUserFromCookie();

  if (!authUser) {
    return {
      allowed: false,
      response: errorResponse("Unauthorized.", 401),
    };
  }

  if (authUser.role !== USER_ROLES.ADMIN) {
    return {
      allowed: false,
      response: errorResponse("Only admin can manage staff users.", 403),
    };
  }

  return {
    allowed: true,
  };
}

export async function GET() {
  try {
    await connectDB();

    const access = await checkSuperAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const users = await User.find({
      role: {
        $in: STAFF_ROLES,
      },
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse("Staff users fetched successfully.", users);
  } catch (error) {
    console.error("GET_STAFF_USERS_ERROR", error);
    return errorResponse("Failed to fetch staff users.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const access = await checkSuperAdminAccess();

    if (!access.allowed) {
      return access.response;
    }

    const body = await request.json();
    const result = createStaffUserSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { fullName, email, phone, password, role, status } = result.data;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return errorResponse("Email already exists.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      status: status ?? "ACTIVE",
    });

    const createdUser = await User.findById(user._id).select("-password");

    return successResponse(
      "Staff user created successfully.",
      createdUser,
      201,
    );
  } catch (error) {
    console.error("CREATE_STAFF_USER_ERROR", error);
    return errorResponse("Failed to create staff user.", 500);
  }
}
