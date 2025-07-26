import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, refreshAccessToken } from "@/lib/auth";

export const runtime = "experimental-edge";

const publicPaths = [
  "/",
  "/cookies",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/health",
  "/terms",
  "/privacy",
];

const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) => path.startsWith(publicPath));
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/transform")) {
    const response = NextResponse.next();

    const sessionId = request.cookies.get("currentSessionId")?.value;

    if (sessionId) {
      response.headers.set("x-session-id", sessionId);
    }

    return handleAuth(request, response);
  }

  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  return handleAuth(request);
}

async function handleAuth(
  request: NextRequest,
  response = NextResponse.next()
) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await verifyAccessToken(accessToken);

    if (!user) {
      const refreshResponse = await refreshAccessToken(request);

      if (!refreshResponse) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      return refreshResponse;
    }

    return response;
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const user = await verifyAccessToken(accessToken);

  if (!user) {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const refreshResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    if (!refreshResponse.ok) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const setCookieHeader = refreshResponse.headers.getSetCookie();

    setCookieHeader.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/api/transform/:path*",
  ],
};
