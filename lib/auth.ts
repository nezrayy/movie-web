// @ts-nocheck

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking multiple accounts with the same email
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (user) {
          // Periksa status user
          if (user.status === "SUSPENDED") {
            throw new Error("Your account is suspended");
          }

          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: profile.sub,
              userId: user.id,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                provider: "google",
                providerAccountId: profile.sub,
                type: "oauth",
                userId: user.id,
              },
            });
          }

          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
          };
        }

        // Jika user baru, buat akun baru
        const username =
          profile.name.replace(/\s+/g, "").toLowerCase() ||
          profile.email.split("@")[0];
        const newUser = await prisma.user.create({
          data: {
            username: username,
            email: profile.email,
            emailVerified: new Date(),
            accounts: {
              create: {
                provider: "google",
                providerAccountId: profile.sub,
                type: "oauth",
              },
            },
          },
        });

        return {
          id: newUser.id.toString(),
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Wrong email or password");
        }

        if (user.status === "SUSPENDED") {
          throw new Error(
            "Your account has been suspended. Contact admin for more info."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Wrong email or password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status, // Pastikan status dikembalikan
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.status === "SUSPENDED") {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(token.id, 10) },
      });

      if (!user || user.status === "SUSPENDED") {
        return null;
      }

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.status = user.status;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.status = user.status;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
});
