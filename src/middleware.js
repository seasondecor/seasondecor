import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  { path: "/user", allowedRoles: [2, 3] },
  { path: "/admin", allowedRoles: [1] },
  { path: "/seller", allowedRoles: [2, 3] },
  { path: "/booking/request", allowedRoles: [2, 3] },
];

const publicRoutes = ["/", "/products", "/provider", "/support"]; // Add any public routes here

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;
  const { pathname } = req.nextUrl;

  // If no token and trying to access protected routes, redirect to login
  if (!accessToken) {
    if (pathname.startsWith("/authen/login") || pathname.startsWith("/authen/signup")) {
      return NextResponse.next(); // Allow access to login/signup
    }
    
    // Check if trying to access protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route.path));
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/authen/login", req.url));
    }
    
    // Allow access to public routes without token
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }

  // Redirect authenticated users away from login/signup
  if (pathname.startsWith("/authen/login") || pathname.startsWith("/authen/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRoleId = token.roleId;

  // Role-based redirections for root path
  if ((pathname === "/" || pathname === "") && accessToken) {
    switch (userRoleId) {
      case 1: // Admin
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      case 2: // Provider
        return NextResponse.redirect(new URL("/seller/dashboard", req.url));
      default:
        return NextResponse.next();
    }
  }

  // Prevent unauthorized access to role-specific areas
  if (userRoleId !== 1 && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  if (userRoleId !== 2 && pathname.startsWith("/seller")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check protected routes access
  const matchedRoute = protectedRoutes.find((route) => pathname.startsWith(route.path));
  if (matchedRoute && !matchedRoute.allowedRoles.includes(userRoleId)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/seller/:path*",
    "/authen/:path*",
    "/user/:path*",
    "/booking/request/:path*",
  ],
};
