import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = req.nextUrl.pathname.startsWith("/admin");

    // Proteger rotas /admin
    if (isAdmin && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verificar se tem permissão (role admin ou secretary)
    if (
      isAdmin &&
      token?.role !== "admin" &&
      token?.role !== "secretary"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configurar quais rotas o middleware deve proteger
export const config = {
  matcher: ["/admin/:path*"],
};
