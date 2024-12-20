import type { Metadata } from "next";
import { DM_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

const font = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rewatch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={font.className}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
