import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const { countryId } = params;
  console.log("Deleting country with ID:", params.countryId); // Debugging

  try {
    await prisma.country.delete({
      where: { id: parseInt(countryId, 10) }, // Hapus komentar berdasarkan countryId
    });

    return NextResponse.json(
      { message: "Country deleted successfully" },
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

    const existingCountryByCode = await prisma.country.findFirst({
      where: {
        code,
        NOT: { id: countryId },
      },
    });

    if (existingCountryByName) {
      return NextResponse.json(
        { message: "Country name already exists" },
        { status: 400 }
      );
    }

    if (existingCountryByCode) {
      return NextResponse.json(
        { message: "Country code already exists" },
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