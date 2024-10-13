import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/email-service";
import { addMinutes } from "date-fns";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  // Cari pengguna berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "No user found with this email" }, { status: 404 });
  }

  // Buat token reset password
  const resetToken = uuidv4();
  const resetTokenExpiry = addMinutes(new Date(), 60); // Token berlaku selama 60 menit

  // Simpan token dan masa kedaluwarsa di database
  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry,
    },
  });

  // Kirim email dengan tautan reset password
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<p>Click this link to reset your password:</p>
    <a href="${resetUrl}" style="background-color: orange; padding: 10px; color: white; text-decoration: none;">Reset Password</a>`,
  });

  return NextResponse.json({ message: "Reset password email sent" }, { status: 200 });
}
