import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Pastikan prisma sudah diinisialisasi dengan benar

export async function GET(request: Request) {
  const movies = await prisma.movie.findMany({
    include: {
      genres: {
        include: {
          genre: true, // Meng-include tabel Genre
        },
      },
    },
  });

  // Jika tidak ada film yang ditemukan
  if (movies.length === 0) {
    return NextResponse.json({ message: "No movies found" }, { status: 404 });
  }

  // Jika film ditemukan, kembalikan hasil pencarian
  return NextResponse.json(movies, { status: 200 });
}
