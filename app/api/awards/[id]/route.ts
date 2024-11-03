import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // Tambahkan context untuk mendapatkan parameter id
) {
  const { id } = context.params;

  try {
    // Pastikan `id` di-cast ke Number
    const award = await prisma.award.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        movie: true,
        country: true,
      },
    });

    if (!award) {
      return new NextResponse("Award not found", {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(award), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching awards:", error);
    return new NextResponse("Something went wrong while fetching awards.", {
      status: 500,
    });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // Parse body request sebagai JSON
    const body = await request.json();

    // Update data award berdasarkan body yang diterima
    const award = await prisma.award.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        awardYear: Number(body.year), // Pastikan tipe data yang dikirimkan sesuai
        description: body.description,
        movieId: Number(body.movie), // Mengubah movie ID jika ada
        countryId: Number(body.country), // Mengubah country ID
      },
    });

    return new NextResponse(JSON.stringify(award), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating award:", error);
    return new NextResponse("Something went wrong while updating award.", {
      status: 500,
    });
  }
}