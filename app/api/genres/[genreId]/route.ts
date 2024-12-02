import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { genreId: string } }
) {
  const genreId = parseInt(params.genreId, 10);

  if (isNaN(genreId)) {
    return NextResponse.json({ message: "Invalid genre ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    const existingGenreByName = await prisma.genre.findFirst({
      where: {
        name,
        NOT: { id: genreId },
      },
    });

    if (existingGenreByName) {
      return NextResponse.json(
        { message: "Genre name already exists" },
        { status: 400 }
      );
    }

    const updatedgenre = await prisma.genre.update({
      where: { id: genreId },
      data: { name },
    });

    return NextResponse.json(updatedgenre, { status: 200 });
  } catch (error) {
    console.error("Error updating genre:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { genreId: string } }
) {
  const genreId = parseInt(params.genreId, 10);

  if (isNaN(genreId)) {
    return NextResponse.json({ message: "Invalid genre ID" }, { status: 400 });
  }

  console.log("Deleting genre with ID:", genreId);

  try {
    // Validasi jika genre terhubung ke entitas lain
    const linkedMovies = await prisma.movieGenre.findMany({
      where: { genreId },
    });

    console.log("Linked movies:", linkedMovies);

    if (linkedMovies.length > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete genre. The genre is linked to one or more movies.",
        },
        { status: 400 }
      );
    }

    // Hapus genre
    await prisma.genre.delete({
      where: { id: genreId },
    });

    console.log("Genre deleted successfully.");
    return NextResponse.json(
      { message: "Genre deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting genre. Details:", error.message);
    return NextResponse.json(
      { message: "Failed to delete genre", error: error.message },
      { status: 500 }
    );
  }
}
