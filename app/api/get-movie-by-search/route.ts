import { NextResponse } from 'next/server';
import prisma from '@/lib/db';  // Pastikan prisma sudah diinisialisasi dengan benar

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search_query');
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  // Jika search_query kosong atau tidak ada
  if (!searchQuery || searchQuery.trim() === "") {
    return NextResponse.json({ message: 'No search query provided' }, { status: 400 });
  }

  try {
    // Lakukan pencarian di tabel movies berdasarkan title atau synopsis
    const moviesByTitle = await prisma.movie.findMany({
      where: {
        title: {
          contains: searchQuery,
        },
      },
      skip: offset,
      take: limit,
      include: {
        country: true,
        genres: {
          select: {
            genre: true,  // Sertakan genre dari relasi MovieGenre
          },
        },
        actors: true,
      },
    });
    
    const moviesBySynopsis = await prisma.movie.findMany({
      where: {
        AND: [
          {
            synopsis: {
              contains: searchQuery,
            },
          },
          {
            id: {
              notIn: moviesByTitle.map(movie => movie.id),
            },
          },
        ],
      },
      skip: offset,
      take: limit,
      include: {
        country: true,
        genres: true,
        actors: true,
      },
    });
    
    // Menggabungkan hasil, prioritaskan moviesByTitle
    const movies = [...moviesByTitle, ...moviesBySynopsis];
    

    // Jika tidak ada film yang ditemukan
    if (movies.length === 0) {
      return NextResponse.json({ message: 'No movies found' }, { status: 404 });
    }

    // Jika film ditemukan, kembalikan hasil pencarian
    return NextResponse.json(movies, { status: 200 });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ message: 'Error fetching movies' }, { status: 500 });
  }
}
