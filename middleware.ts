import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Публічні шляхи - доступні всім без авторизації
const publicPaths = [
  "/",
  "/api/auth",
  "/auth/error",
  "/debug/auth",
  "/tags",
];

// Перевірка чи шлях публічний
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаємо статичні файли та публічні шляхи
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  // Для /docs - просто пропускаємо, захист реалізований через DocContentWrapper
  // Це дозволяє показувати гарний UI замість редиректу
  if (pathname.startsWith("/docs")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};
