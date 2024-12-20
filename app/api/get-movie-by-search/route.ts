// import { NextResponse } from 'next/server';
// import prisma from '@/lib/db';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const searchQuery = searchParams.get('search_query');
//   const year = searchParams.get('year');
//   const genre = searchParams.get('genre');
//   const status = searchParams.get('status');
//   const availability = searchParams.get('availability');
//   const award = searchParams.get('award');
//   const sortedBy = searchParams.get('sortedBy');
//   const offset = parseInt(searchParams.get("offset") || "0", 10);
//   const limit = parseInt(searchParams.get("limit") || "12", 10);

//   // Jika search_query kosong atau tidak ada
//   if (!searchQuery || searchQuery.trim() === "") {
//     return NextResponse.json({ message: 'No search query provided' }, { status: 400 });
//   }

//   try {
//     // Bangun filter berdasarkan query params
//     const filters: any = {
//       OR: [
//         {
//           title: {
//             contains: searchQuery,
//           },
//         },
//         {
//           synopsis: {
//             contains: searchQuery,
//           },
//         },
//       ],
//     };

//     if (year) {
//       filters.releaseYear = parseInt(year, 10);
//     }
//     if (status) {
//       filters.status = status.toUpperCase();
//     }
//     if (availability) {
//       filters.availability = availability;
//     }
//     if (award) {
//       filters.awards = {
//         some: {
//           name: {
//             contains: award,
//           },
//         },
//       };
//     }
//     if (genre) {
//       filters.genres = {
//         some: {
//           genre: {
//             name: genre,
//           },
//         },
//       };
//     }

//     const movies = await prisma.movie.findMany({
//       where: filters,
//       skip: offset,
//       take: limit + 1,
//       orderBy:
//         sortedBy === 'z-a' ? { title: 'desc' } :
//         sortedBy === 'a-z' ? { title: 'asc' } :
//         sortedBy === 'oldest' ? { releaseYear: 'asc' } :
//         { releaseYear: 'desc' },
//       include: {
//         country: true,
//         genres: {
//           select: {
//             genre: true,
//           },
//         },
//         actors: {
//           select: {
//             actor: true,
//           }
//         },
//       },
//     });

//     // Jika tidak ada film yang ditemukan
//     if (movies.length === 0) {
//       return NextResponse.json([], { status: 404 });
//     }

//     // Jika film ditemukan, kembalikan hasil pencarian
//     return NextResponse.json(movies, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching movies:', error);
//     return NextResponse.json({ message: 'Error fetching movies' }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { Prisma } from "@prisma/client";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const searchQuery = searchParams.get("search_query");
//   const year = searchParams.get("year");
//   const genre = searchParams.get("genre");
//   const status = searchParams.get("status");
//   const availability = searchParams.get("availability");
//   const award = searchParams.get("award");
//   const sortedBy = searchParams.get("sortedBy");
//   const offset = parseInt(searchParams.get("offset") || "0", 10);
//   const limit = parseInt(searchParams.get("limit") || "12", 10);

//   // Jika search_query kosong atau tidak ada
//   if (!searchQuery || searchQuery.trim() === "") {
//     return NextResponse.json(
//       { message: "No search query provided" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Bangun filter berdasarkan query params
//     const filters: any = {
//       isDeleted: false,
//       status: "APPROVE",
//       OR: [
//         {
//           title: {
//             contains: searchQuery,
//           },
//         },
//         {
//           synopsis: {
//             contains: searchQuery,
//           },
//         },
//       ],
//     };

//     // Logika filter untuk tahun
//     if (year) {
//       if (year === "<1990") {
//         filters.releaseYear = { lt: 1990 }; // Tahun sebelum 1990
//       } else if (year.includes("-")) {
//         const [startYear, endYear] = year.split("-").map(Number);
//         filters.releaseYear = { gte: startYear, lte: endYear }; // Rentang tahun
//       } else {
//         filters.releaseYear = parseInt(year, 10); // Tahun tunggal jika diperlukan
//       }
//     }

//     if (status) {
//       filters.status = status.toUpperCase();
//     }
//     if (availability) {
//       filters.availability = availability;
//     }
//     if (award) {
//       filters.awards = {
//         some: {
//           name: {
//             contains: award,
//           },
//         },
//       };
//     }
//     if (genre) {
//       filters.genres = {
//         some: {
//           genre: {
//             name: genre,
//           },
//         },
//       };
//     }

//     const movies = await prisma.movie.findMany({
//       where: filters,
//       skip: offset,
//       take: limit + 1,
//       orderBy:
//         sortedBy === "z-a"
//           ? { title: "desc" }
//           : sortedBy === "a-z"
//           ? { title: "asc" }
//           : sortedBy === "oldest"
//           ? { releaseYear: "asc" }
//           : { releaseYear: "desc" }, // Default ke newest
//       select: {
//         id: true,
//         title: true,
//         releaseYear: true,
//         posterUrl: true, // Pastikan posterUrl diambil
//         genres: {
//           select: {
//             genre: true,
//           },
//         },
//         actors: {
//           select: {
//             actor: true,
//           },
//         },
//       },
//     });

//     // Jika tidak ada film yang ditemukan
//     if (movies.length === 0) {
//       return NextResponse.json([], { status: 404 });
//     }

//     // Jika film ditemukan, kembalikan hasil pencarian
//     return NextResponse.json(movies, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching movies:", error);
//     return NextResponse.json(
//       { message: "Error fetching movies" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search_query");
  const year = searchParams.get("year");
  const genre = searchParams.get("genre");
  const status = searchParams.get("status");
  const availability = searchParams.get("availability");
  const award = searchParams.get("award");
  const sortedBy = searchParams.get("sortedBy");
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  if (!searchQuery || searchQuery.trim() === "") {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const filters: any = {
      isDeleted: false,
      status: "APPROVE",
      OR: [
        { title: { contains: searchQuery } },
        { synopsis: { contains: searchQuery } },
      ],
    };

    if (year) {
      if (year === "<1990") {
        filters.releaseYear = { lt: 1990 };
      } else if (year.includes("-")) {
        const [startYear, endYear] = year.split("-").map(Number);
        filters.releaseYear = { gte: startYear, lte: endYear };
      } else {
        filters.releaseYear = parseInt(year, 10);
      }
    }

    if (status) filters.status = status.toUpperCase();
    if (availability) filters.availability = availability;
    if (award) {
      filters.awards = {
        some: { name: { contains: award } },
      };
    }
    if (genre) {
      filters.genres = {
        some: { genre: { name: genre } },
      };
    }

    const movies = await prisma.movie.findMany({
      where: filters,
      skip: offset,
      take: limit,
      orderBy:
        sortedBy === "z-a"
          ? { title: "desc" }
          : sortedBy === "a-z"
          ? { title: "asc" }
          : sortedBy === "oldest"
          ? { releaseYear: "asc" }
          : { releaseYear: "desc" },
      select: {
        id: true,
        title: true,
        releaseYear: true,
        posterUrl: true,
        genres: {
          select: { genre: { select: { name: true } } },
        },
        actors: {
          select: { actor: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ message: "Error fetching movies" }, { status: 500 });
  }
}
