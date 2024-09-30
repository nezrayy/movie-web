// pages/api/get-genres.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const genres = await prisma.genre.findMany();
    return NextResponse.json(genres, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching genres" },
      { status: 500 }
    );
  }
}
