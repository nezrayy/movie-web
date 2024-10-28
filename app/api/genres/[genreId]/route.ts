import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { genreId: string } }
) {
  const { genreId } = params;

  try {
    const existingGenre = await prisma.genre.findUnique({
      where: { id: parseInt(genreId, 10) },
    });

    if (!existingGenre) {
      return NextResponse.json({ message: "Genre not found" }, { status: 404 });
    }
    const { name } = await request.json();

    const updatedGenre = await prisma.genre.update({
      where: { id: parseInt(genreId, 10) },
      data: { name },
    });
    return NextResponse.json(updatedGenre, { status: 200 });
  } catch (error) {}
}

export async function DELETE(
  request: Request,
  { params }: { params: { genreId: string } }
) {
  const { genreId } = params;
  console.log("Deleting genre with ID:", params.genreId);

  try {
    await prisma.genre.delete({
      where: { id: parseInt(genreId, 10) },
    });

    return NextResponse.json(
      { message: "Genre deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting genre:", error);
    return NextResponse.json(
      { message: "Failed to delete genre", error: error.message },
      { status: 500 }
    );
  }
}
