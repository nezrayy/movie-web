import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const actors = await prisma.actor.findMany();
    return NextResponse.json(actors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching actors" },
      { status: 500 }
    );
  }
}