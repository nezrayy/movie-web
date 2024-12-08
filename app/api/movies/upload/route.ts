import prisma from "@/lib/db"; // Import Prisma client Anda

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      posterUrl, // Ganti image/fileName menjadi posterUrl
      title,
      alternativeTitle,
      releaseYear,
      synopsis,
      createdById,
      countryId,
      genres,
      actors,
      availabilities,
      linkTrailer,
    } = body;

    if (!posterUrl || !title || !createdById || !countryId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cek apakah id yang digunakan untuk relasi ada
    const createdBy = await prisma.user.findUnique({
      where: { id: parseInt(createdById) },
    });
    if (!createdBy) {
      return new Response(JSON.stringify({ error: "Invalid `createdById`." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const country = await prisma.country.findUnique({
      where: { id: parseInt(countryId) },
    });
    if (!country) {
      return new Response(JSON.stringify({ error: "Invalid `countryId`." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simpan data film menggunakan Prisma
    const movie = await prisma.movie.create({
      data: {
        title,
        alternativeTitle,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        synopsis,
        posterUrl, // Simpan link langsung
        linkTrailer,
        createdBy: { connect: { id: parseInt(createdById) } },
        country: { connect: { id: parseInt(countryId) } },
        genres:
          genres?.length > 0
            ? {
                create: genres.map((genreId) => ({
                  genre: { connect: { id: parseInt(genreId) } },
                })),
              }
            : undefined,
        actors:
          actors?.length > 0
            ? {
                create: actors.map((actorId) => ({
                  actor: { connect: { id: parseInt(actorId) } },
                })),
              }
            : undefined,
        availabilities:
          availabilities?.length > 0
            ? {
                create: availabilities.map((availabilityId) => ({
                  availability: { connect: { id: parseInt(availabilityId) } },
                })),
              }
            : undefined,
      },
    });

    return new Response(JSON.stringify({ movie }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving movie:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong while saving the movie." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
