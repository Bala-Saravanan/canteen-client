import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const ADMIN_ROUTES = ["/dashboard", "/admin"];
const USER_ROUTES = ["/menu", "/orders", "/receipt"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("PATH:", pathname);
  console.log("TOKEN:", token);

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // No token → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // OPTIONAL: Decode role from token (if needed)
  // const role = getRoleFromToken(token);

  // Protect admin routes
  // if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && role !== "admin") {
  //   return NextResponse.redirect(new URL("/menu", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
