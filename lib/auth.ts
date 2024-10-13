import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from 'bcryptjs';  // Pastikan bcryptjs sudah diinstal

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Validasi tipe credentials
        if (!credentials || typeof credentials.email !== "string" || typeof credentials.password !== "string") {
          throw new Error("Invalid credentials");
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Jika user tidak ditemukan
        if (!user) {
          throw new Error("User not found.");
        }

        // Periksa kecocokan password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        // Jika login berhasil, kembalikan user object
        return {
          id: user.id.toString(),  // Convert number ID to string
          email: user.email,
          name: user.username,
          role: user.role
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",  // Arahkan halaman login ke /login
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,  // Pastikan NEXTAUTH_SECRET sudah ada di .env
});

