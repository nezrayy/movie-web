import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";  // Untuk membuat token unik
import sendVerificationEmail from "@/lib/email-service";  // Anda harus membuat fungsi untuk mengirim email

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Cek apakah email atau username sudah ada di tabel User
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists." }, { status: 400 });
    }

    // Cek apakah email sudah ada di tabel PreUser (proses pendaftaran sebelumnya)
    const existingPreUser = await prisma.preUser.findUnique({
      where: { email }
    });

    if (existingPreUser) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat token verifikasi email
    const emailToken = uuidv4();

    // Simpan pengguna ke dalam tabel PreUser dengan status 'unverified'
    await prisma.preUser.create({
      data: {
        username,
        email,
        password: hashedPassword,
        emailToken,  // Simpan token verifikasi
        status: 'UNVERIFIED'
      }
    });

    // Ambil base URL secara dinamis
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/verify-email?token=${emailToken}`;
    
    // Kirim email verifikasi
    await sendVerificationEmail(email, verificationUrl);

    return NextResponse.json({ message: "Verification email sent. Please check your inbox." }, { status: 200 });
    
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "Registration failed." }, { status: 500 });
  }
}
