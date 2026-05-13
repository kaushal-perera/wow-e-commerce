import { jwtVerify, SignJWT } from "jose";
import { UserRole } from "./roles";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing in environment variables.");
}

const encodedSecret = new TextEncoder().encode(secret);

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export async function signToken(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(encodedSecret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, encodedSecret);

  return payload as JwtPayload & {
    iat: number;
    exp: number;
  };
}
