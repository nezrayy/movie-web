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
        // Check if the user already exists based on email
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (user) {
          // If the user exists, check if the Google account is already linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: profile.sub,
              userId: user.id,
            },
          });

          if (!existingAccount) {
            // If the account does not exist yet, link the Google account
            await prisma.account.create({
              data: {
                provider: "google",
                providerAccountId: profile.sub,
                type: "oauth",
                userId: user.id,
              },
            });
          }

          // Return the existing user
          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
          };
        }

        // If the user does not exist, create a new account
        const username = profile.name.replace(/\s+/g, "").toLowerCase() || profile.email.split("@")[0];
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
        if (!credentials || typeof credentials.email !== "string" || typeof credentials.password !== "string") {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Wrong email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Wrong email or password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          role: user.role
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
    async session({ session, token }) {
    session.user.id = token.id;
    session.user.role = token.role;
    session.user.username = token.username;
    return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
});
