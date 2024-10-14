import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log("withAuth middleware...");
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // Redirect /admin to /admin/dashboard
      if (request.nextUrl.pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // Here you can add additional checks, e.g., for admin role
      // if (request.nextauth.token?.role !== 'admin') {
      //   return NextResponse.redirect(new URL('/unauthorized', request.url))
      // }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/signin",
    },
  },
);

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
