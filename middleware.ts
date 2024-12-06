import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Daftar folder yang hanya bisa diakses oleh admin
const adminPaths = [
  "/cms-actors",
  "/cms-awards",
  "/cms-comments",
  "/cms-countries",
  "/cms-film-input",
  "/cms-films",
  "/cms-genres",
  "/cms-header",
  "/cms-users",
];

// Middleware utama
export async function middleware(req: NextRequest) {
  // Ambil token JWT untuk mendapatkan role pengguna
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // secureCookie: true,
  });
  // console.log("Token:", token);
  // Dapatkan URL path dari request
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/verify-email")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Cek apakah path API diakses
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    // Pastikan hanya permintaan dari localhost:3000 yang diizinkan
    if (process.env.FRONTEND_URL) {
      if (
        !origin?.includes(process.env.FRONTEND_URL) &&
        !referer?.includes(process.env.FRONTEND_URL)
      ) {
        return new NextResponse("Access denied", { status: 403 });
      }
    }
  }

  // Cek apakah path ada dalam daftar path admin
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect ke home jika sudah login
    }
  }

  // Jika path membutuhkan admin dan user tidak punya token, redirect ke login
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Jika token ada, cek apakah role adalah admin
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect ke halaman home
    }
  }

  // Lanjutkan jika user punya akses
  return NextResponse.next();
}

// Aktifkan middleware hanya untuk path /api/* dan halaman admin
export const config = {
  matcher: [
    "/api/:path*",
    "/cms-actors/:path*",
    "/cms-awards/:path*",
    "/cms-comments/:path*",
    "/cms-countries/:path*",
    "/cms-film-input/:path*",
    "/cms-films/:path*",
    "/cms-genres/:path*",
    "/cms-header/:path*",
    "/cms-users/:path*",
    "/login",
    "/register",
  ],
};
