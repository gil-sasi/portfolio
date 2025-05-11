import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_very_secret_key_12345";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any;

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.warn("Invalid token in middleware:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
