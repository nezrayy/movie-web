import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { movieId: string } }) {
  const { movieId } = params;

  try {
    // Ambil komentar dengan status APPROVE untuk movie tertentu
    const approvedComments = await prisma.comment.findMany({
      where: {
        movieId: parseInt(movieId, 10),
        status: "APPROVE",
      },
      select: {
        rating: true,
      },
    });

    if (approvedComments.length === 0) {
      return NextResponse.json(
        { message: "No approved comments found for this movie." },
        { status: 404 }
      );
    }

    // Hitung rata-rata rating
    const totalRating = approvedComments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = totalRating / approvedComments.length;

    // Update nilai rating pada tabel movie
    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(movieId, 10) },
      data: { rating: averageRating },
    });

    return NextResponse.json(
      { message: "Movie rating updated successfully", rating: updatedMovie.rating },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating movie rating:", error);
    return NextResponse.json(
      { message: "Failed to calculate movie rating", error: error.message },
      { status: 500 }
    );
  }
}
