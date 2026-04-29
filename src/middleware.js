import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("access_token");

  if (!token && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profiles", "/search", "/account"]
};