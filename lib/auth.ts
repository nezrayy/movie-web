import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
    
    }),
  ],
})