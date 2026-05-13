import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const authUser = await getCurrentUserFromCookie();

    if (!authUser) {
      return errorResponse("Unauthorized.", 401);
    }

    const user = await User.findById(authUser.userId).select("-password");

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    return successResponse("User fetched successfully.", user);
  } catch (error) {
    console.error("ME_ERROR", error);
    return errorResponse("Something went wrong.", 500);
  }
}
