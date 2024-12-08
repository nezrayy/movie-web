import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { actorId: string } }
) {
  const actorId = parseInt(params.actorId, 10);

  if (isNaN(actorId)) {
    return NextResponse.json({ message: "Invalid actor ID" }, { status: 400 });
  }

  try {
    // Validasi jika actor terhubung ke entitas lain
    const linkedMovies = await prisma.movieActor.findMany({
      where: {
        actorId: actorId,
      },
    });

    if (linkedMovies.length > 0) {
      return NextResponse.json(
        {
          message:
            "Cannot delete actor. The actor is linked to one or more movies.",
        },
        { status: 400 }
      );
    }

    await prisma.actor.delete({
      where: {
        id: actorId,
      },
    });

    return NextResponse.json(
      { message: "Actor deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting actor:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { actorId: string } }
) {
  const actorId = parseInt(params.actorId, 10);

  if (isNaN(actorId)) {
    return NextResponse.json({ message: "Invalid actor ID" }, { status: 400 });
  }

  try {
    // Parse form data
    const jsonBody = await request.json();
    const name = jsonBody.name?.toString();
    const birthdate = jsonBody.birthdate
      ? new Date(jsonBody.birthdate.toString())
      : null;
    const countryId = parseInt(jsonBody.countryId, 10); // Convert to Int
    const photoUrl = jsonBody.photoUrl?.toString();

    if (!name || !birthdate || isNaN(countryId)) {
      return NextResponse.json(
        { message: "Invalid or incomplete data provided" },
        { status: 400 }
      );
    }

    // Update actor di database
    const updatedActor = await prisma.actor.update({
      where: { id: actorId },
      data: {
        name,
        birthdate,
        photoUrl,
        country: {
          connect: { id: countryId },
        },
      },
    });

    return NextResponse.json(updatedActor, { status: 200 });
  } catch (error) {
    console.error("Error updating actor:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
