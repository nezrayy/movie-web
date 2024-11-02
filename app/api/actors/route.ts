import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  // Ambil query `search` dari URL
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";

  try {
    const actors = await prisma.actor.findMany({
      where: {
        name: {
          contains: search,
          // mode: "insensitive", // Pastikan Prisma mendukung ini, atau bisa diabaikan jika tidak
        },
      },
      take: 10, // Batasi hasil pencarian
    });

    return NextResponse.json(actors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching actors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const birthdate = formData.get("birthdate") ? new Date(formData.get("birthdate").toString()) : null;
    const countryId = parseInt(formData.get("countryId")?.toString() || "0", 10);
    const file = formData.get("image") as File | null;

    if (!name || isNaN(countryId) || (birthdate && isNaN(birthdate.getTime()))) {
      return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
    }

    let photoUrl = null;
    if (file) {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'actors', filename);

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      photoUrl = `/images/actors/${filename}`;
    }

    const newActor = await prisma.actor.create({
      data: {
        name,
        birthdate,
        photoUrl,
        country: {
          connect: { id: countryId },
        },
      },
    });

    return NextResponse.json(newActor, { status: 201 });
  } catch (error) {
    console.error("Error creating actor:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
