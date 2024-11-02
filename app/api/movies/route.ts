import { NextResponse } from "next/server";
import prisma from "@/lib/db"; 
import { Prisma } from "@prisma/client"; 

export async function GET(request: Request) {
  // Ambil query parameter dari URL
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sort") || "year_desc"; // Default sort by title A-Z
  const yearFilter = searchParams.get("year") || ""; // Tahun default (kosong untuk tidak ada filter)
  const genreFilter = searchParams.get("genre") || ""; // Genre default (kosong untuk tidak ada filter)
  const availabilityFilter = searchParams.get("availability") || ""; // Filter availability

  // Prepare where clause untuk filtering
  const where: Prisma.MovieWhereInput = {};

  // Filter berdasarkan tahun
  if (yearFilter) {
    if (yearFilter === "<1990") {
      where.releaseYear = { lt: 1990 };
    } else {
      const [startYear, endYear] = yearFilter.split("_");
      where.releaseYear = {
        gte: parseInt(startYear),
        lte: parseInt(endYear),
      };
    }
  }

  // Filter berdasarkan genre
  if (genreFilter) {
    where.genres = {
      some: {
        genre: {
          name: genreFilter, // Filter berdasarkan nama genre
        },
      },
    };
  }

  // Filter berdasarkan availability
  if (availabilityFilter) {
    where.availability = availabilityFilter;
  }

  // Sorting berdasarkan parameter yang diberikan
  const orderBy: Prisma.MovieOrderByWithRelationInput = {};
  switch (sortBy) {
    case "title_asc":
      orderBy.title = "asc";
      break;
    case "title_desc":
      orderBy.title = "desc";
      break;
    case "rating_asc":
      orderBy.rating = "asc";
      break;
    case "rating_desc":
      orderBy.rating = "desc";
      break;
    case "year_asc":
      orderBy.releaseYear = "asc";
      break;
    case "year_desc":
      orderBy.releaseYear = "desc";
      break;
    default:
      orderBy.releaseYear = "desc";      // Default sorting
      break;
  }

  // Query untuk mendapatkan data film dengan filtering dan sorting
  const movies = await prisma.movie.findMany({
    where,
    orderBy,
    include: {
      genres: {
        include: {
          genre: true, // Meng-include tabel Genre
        },
      },
      actors: {
        include: {
          actor: true, // Meng-include tabel Actor
        }
      },
      availabilities: {
        include: {
          availability: true, // Meng-include tabel Availability
        }
      }
    },
  });

  // Jika tidak ada film yang ditemukan
  if (movies.length === 0) {
    return NextResponse.json({ message: "No movies found" }, { status: 404 });
  }

  // Jika film ditemukan, kembalikan hasil pencarian
  return NextResponse.json(movies, { status: 200 });
}

