import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/roles";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/account");
  const isCheckoutRoute = pathname.startsWith("/checkout");

  if (!isAdminRoute && !isAccountRoute && !isCheckoutRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyToken(token);

    // Admin pages: only admin/staff roles can access
    if (isAdminRoute) {
      if (!ADMIN_ROLES.includes(payload.role as any)) {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      return NextResponse.next();
    }

    // Customer pages: only CUSTOMER can access
    if (isAccountRoute || isCheckoutRoute) {
      if (payload.role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
