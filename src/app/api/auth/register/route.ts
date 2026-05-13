import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/validations/authValidation";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { USER_ROLES } from "@/lib/roles";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const { fullName, email, phone, password } = result.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return errorResponse("Email already registered.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: USER_ROLES.CUSTOMER,
      status: "ACTIVE",
    });

    return successResponse(
      "Account created successfully.",
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      201,
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return errorResponse("Something went wrong while registering.", 500);
  }
}
