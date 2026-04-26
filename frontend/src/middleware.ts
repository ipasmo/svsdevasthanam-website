import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ─── Admin Route Protection ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─── Redirect logged-in users away from login ────────────────────────────
  if (pathname.startsWith("/auth/login")) {
    const token = request.cookies.get("auth_token")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|manifest.json).*)",
  ],
};
