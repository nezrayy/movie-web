import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    // Check if the genre already exists
    const existingGenre = await prisma.genre.findUnique({
      where: {
        name,
      },
    });

    // If genre exists, return an error response
    if (existingGenre) {
      return NextResponse.json(
        { message: "Genre already exists" },
        { status: 400 }
      );
    }

    // Create new genre if it doesn't exist
    const newGenre = await prisma.genre.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newGenre, { status: 201 });
  } catch (error) {
    console.log("Error creating genre:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

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
