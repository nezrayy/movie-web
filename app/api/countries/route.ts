import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, code } = await request.json();
  if (!name || !code) {
    return NextResponse.json(
      { message: "Name and code are required" },
      { status: 400 }
    );
  }

  try {
    const existingCountry = await prisma.country.findFirst({
      where: {
        name,
      },
    });

    if (existingCountry) {
      return NextResponse.json(
        { message: "Country already exists" },
        { status: 400 }
      );
    }

    const newCountry = await prisma.country.create({
      data: {
        name,
        code,
      },
    });
    return NextResponse.json(newCountry, { status: 201 });
  } catch (error) {
    console.error("Error creating country:", error); // Log error lengkap
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const countries = await prisma.country.findMany({});
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { message: "Failed to fetch countries", error: (error as Error).message },
      { status: 500 }
    );
  }
}
