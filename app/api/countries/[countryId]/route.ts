import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const countryId = parseInt(params.countryId, 10);

  if (isNaN(countryId)) {
    return NextResponse.json(
      { message: "Invalid country ID" },
      { status: 400 }
    );
  }

  try {
    // Simpan semua pengecekan relasi ke dalam array promise
    const relatedEntities = await Promise.all([
      prisma.actor.count({ where: { countryId } }),
      prisma.movie.count({ where: { countryId } }),
      prisma.award.count({ where: { countryId } }),
    ]);

    // Nama-nama entitas untuk pesan error
    const entityNames = ["actors", "movies", "awards"];

    // Kumpulkan entitas yang masih memiliki relasi
    const errorMessages = relatedEntities
      .map((count, index) =>
        count > 0 ? `${count} ${entityNames[index]}` : null
      )
      .filter(Boolean);

    // Jika ada relasi, kembalikan pesan error
    if (errorMessages.length > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete country. It is still associated with: ${errorMessages.join(
            ", "
          )}.`,
        },
        { status: 400 }
      );
    }

    // Jika tidak ada relasi, hapus Country
    await prisma.country.delete({
      where: { id: countryId },
    });

    return NextResponse.json(
      { message: "Country deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
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
    return NextResponse.json(
      { message: "Invalid country ID" },
      { status: 400 }
    );
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
