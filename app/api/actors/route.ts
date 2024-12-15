import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const itemsPerPage = parseInt(url.searchParams.get("itemsPerPage") || "10");

  try {
    const filters: any = {};
    if (search) {
      filters.name = { contains: search };
    }

    const totalActors = await prisma.actor.count({ where: filters });

    const actors = await prisma.actor.findMany({
      where: filters,
      include: { country: true },
      skip: search ? 0 : (page - 1) * itemsPerPage,
      take: search ? undefined : itemsPerPage,
    });

    return NextResponse.json(
      {
        actors,
        total: totalActors,
        currentPage: search ? 1 : page,
        totalPages: Math.ceil(totalActors / itemsPerPage),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching actors:", error);
    return NextResponse.json(
      { error: "Error fetching actors" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, birthdate, countryId, photoUrl } = json;

    if (!name || !birthdate || isNaN(countryId)) {
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 }
      );
    }

    const newActor = await prisma.actor.create({
      data: {
        name,
        birthdate: new Date(birthdate),
        photoUrl,
        country: {
          connect: { id: countryId },
        },
      },
    });

    return NextResponse.json(newActor, { status: 201 });
  } catch (error) {
    console.error("Error creating actor:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
