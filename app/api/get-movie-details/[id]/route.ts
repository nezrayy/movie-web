// app/api/get-movie-details/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // Pastikan prisma sudah diinisialisasi dengan benar

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
        actors: true,
        genres: {
          include: {
            genre: true, // Meng-include tabel Genre
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
