// /api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db"; // Prisma instance

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
  }

  // Cari pengguna berdasarkan token
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: {
        gte: new Date(), // Token masih berlaku
      },
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(password, 10);

  // Perbarui password dan hapus token reset
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null, // Hapus token
      resetPasswordExpiry: null, // Hapus masa berlaku token
    },
  });

  return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
}
