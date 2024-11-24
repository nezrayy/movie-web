import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import fs from "fs";
import path from "path";

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
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const birthdate = formData.get("birthdate")
      ? new Date(formData.get("birthdate").toString())
      : null;
    const countryId = parseInt(
      formData.get("countryId")?.toString() || "0",
      10
    );
    const file = formData.get("image") as File | null;

    if (!name || !birthdate || isNaN(countryId)) {
      return NextResponse.json(
        { message: "Invalid or incomplete data provided" },
        { status: 400 }
      );
    }

    let photoUrl = null;
    if (file) {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "images",
        "actors",
        filename
      );

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      photoUrl = `/images/actors/${filename}`;
    }

    // Update actor di database
    const updatedActor = await prisma.actor.update({
      where: { id: actorId },
      data: {
        name,
        birthdate,
        country: {
          connect: { id: countryId },
        },
        ...(photoUrl && { photoUrl }),
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
