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

    const existinggenreByName = await prisma.genre.findFirst({
      where: {
        name,
        NOT: { id: genreId },
      },
    });

    if (existinggenreByName) {
      return NextResponse.json(
        { message: "genre name already exists" },
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
