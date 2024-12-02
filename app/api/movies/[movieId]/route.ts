import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Dapatkan ID dari URL

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        actors: {
          select: {
            actor: true, // Meng-include tabel Genre
          },
        },
        genres: {
          include: {
            genre: true, // Meng-include tabel Genre
          },
        },
        availabilities: {
          include: {
            availability: true,
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { message: "Error fetching movie details" },
      { status: 500 }
    );
  }
}
