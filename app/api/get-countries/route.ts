import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const countries = await prisma.country.findMany();
    return NextResponse.json(countries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching countries" },
      { status: 500 }
    );
  }
}
