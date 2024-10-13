import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  console.log("Received token:", token);  // Tambahkan ini untuk melihat apakah token diterima

  if (!token) {
    return NextResponse.json({ message: "Invalid token." }, { status: 400 });
  }

  try {
    const preUser = await prisma.preUser.findUnique({
      where: { emailToken: token },
    });

    if (!preUser) {
      return NextResponse.json({ message: "Token not found or expired." }, { status: 400 });
    }

    await prisma.user.create({
      data: {
        username: preUser.username,
        email: preUser.email,
        password: preUser.password,
      },
    });

    await prisma.preUser.delete({
      where: { id: preUser.id },
    });

    // return NextResponse.json({ message: "Email verified successfully. You can now log in." }, { status: 200 });
    return NextResponse.redirect('http://localhost:3000/login');
    
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Failed to verify email." }, { status: 500 });
  }
}
