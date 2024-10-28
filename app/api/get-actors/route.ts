import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  // Ambil query `search` dari URL
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";

  try {
    const actors = await prisma.actor.findMany({
      where: {
        name: {
          contains: search,
          // mode: "insensitive", // Pastikan Prisma mendukung ini, atau bisa diabaikan jika tidak
        },
      },
      take: 10, // Batasi hasil pencarian
    });

    return NextResponse.json(actors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching actors" },
      { status: 500 }
    );
  }
}
