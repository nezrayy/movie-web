import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      username: string; // Pastikan menambahkan properti username
      email: string;
    };
  }

  interface User {
    role: string;
    username: string; // Pastikan menambahkan properti username di sini juga
  }
}