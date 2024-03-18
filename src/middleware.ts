import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/jwt";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}
export async function middleware(req: NextRequest) {
  const token = cookies().get("token")?.value ?? "";

  if (
    (req.nextUrl.pathname.startsWith("/auth/signin") ||
      req.nextUrl.pathname.startsWith("/auth/signup")) &&
    !token
  ) {
    return;
  }

  const response = NextResponse.next();

  try {
    const { sub } = await verifyJWT<{ sub: string }>(token);
    (req as AuthenticatedRequest).user = { id: sub };
  } catch (err: unknown) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const authUser = (req as AuthenticatedRequest).user;
  if (
    (req.url.includes("/auth/signin") || req.url.includes("/auth/signup")) &&
    authUser
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard", "/auth/signin", "/auth/signup"],
};
