import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const { countryId } = params;
  console.log("Deleting country with ID:", params.countryId);

  try {
    await prisma.country.delete({
      where: { id: parseInt(countryId, 10) },
    });

    return NextResponse.json(
      { message: "country deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { message: "Failed to delete country", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const countryId = parseInt(params.countryId, 10);

  if (isNaN(countryId)) {
    return NextResponse.json({ message: "Invalid country ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, code } = body;

    const existingCountryByName = await prisma.country.findFirst({
      where: {
        name,
        NOT: { id: countryId },
      },
    });

    if (existingCountryByName) {
      return NextResponse.json(
        { message: "country name already exists" },
        { status: 400 }
      );
    }

    const updatedCountry = await prisma.country.update({
      where: { id: countryId },
      data: { name, code },
    });

    return NextResponse.json(updatedCountry, { status: 200 });
  } catch (error) {
    console.error("Error updating country:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } } // Tambahkan context untuk mendapatkan parameter id
) {
  const { id } = context.params;

  try {
    // Pastikan `id` di-cast ke Number
    const country = await prisma.country.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!country) {
      return new NextResponse("Award not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(country), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching country:", error);
    return new NextResponse("Something went wrong while fetching awards.", {
      status: 500,
    });
  }
}
