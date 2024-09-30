import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const availabilities = await prisma.availability.findMany();
    return NextResponse.json(availabilities, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching availabilities" },
      { status: 500 }
    );
  }
}
