import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  { path: "/user", allowedRoles: [2, 3] },
  { path: "/admin", allowedRoles: [1] },
  { path: "/seller", allowedRoles: [2, 3] },
  { path: "/booking/request", allowedRoles: [2, 3] },
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;

  const { pathname } = req.nextUrl;

  if (!accessToken) {
    if (
      pathname.startsWith("/authen/login") ||
      pathname.startsWith("/authen/signup")
    ) {
      return NextResponse.next(); // Allow access to login/signup
    }
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }
  
  if (
    token &&
    (pathname.startsWith("/authen/login") ||
      pathname.startsWith("/authen/signup"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRoleId = token.roleId; // Ensure roleId is stored in NextAuth session

  // Redirect based on user role and current path
  if (pathname === "/" || pathname === "") {
    // Role ID 1 is admin
    if (userRoleId === 1) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } 
    // Role ID 2 is seller
    else if (userRoleId === 2) {
      return NextResponse.redirect(new URL("/seller/dashboard", req.url));
    }
  }

  // Redirect sellers away from admin area
  if (userRoleId !== 1 && pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }
  
  // Prevent non-providers from accessing seller dashboard
  if (userRoleId !== 2 && pathname.startsWith("/seller/dashboard")) {
    return NextResponse.redirect(new URL("/authen/login", req.url));
  }

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

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
