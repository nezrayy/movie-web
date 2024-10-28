import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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