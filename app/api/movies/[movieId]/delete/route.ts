import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  context: { params: { movieId: string } }
) {
  try {
    const { movieId } = context.params;
    const movie = await prisma.movie.update({
      where: {
        id: parseInt(movieId, 10),
      },
      data: {
        isDeleted: true, // Tandai movie sebagai dihapus
      },
    });

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return new NextResponse("Something went wrong while deleting movie.", {
      status: 500,
    });
  }
}
