import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export const AUTH_COOKIE_NAME = "wow_token";

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
