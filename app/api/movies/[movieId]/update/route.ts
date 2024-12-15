import prisma from "@/lib/db"; // Prisma client Anda

export const runtime = "nodejs"; // Gunakan Node.js runtime

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      posterUrl, // Ganti image/fileName menjadi posterUrl
      title,
      alternativeTitle,
      releaseYear,
      synopsis,
      countryId,
      genres,
      actors,
      availabilities,
      linkTrailer,
    } = body;

    if (!id || !title || !countryId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update data film di database
    const updatedMovie = await prisma.movie.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        alternativeTitle,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        synopsis,
        posterUrl, // Simpan link langsung
        linkTrailer,
        country: { connect: { id: parseInt(countryId) } },
        genres: {
          deleteMany: {},
          create: genres.map((genreId: number) => ({
            genre: { connect: { id: parseInt(genreId) } },
          })),
        },
        actors: {
          deleteMany: {},
          create: actors.map((actorId: number) => ({
            actor: { connect: { id: parseInt(actorId) } },
          })),
        },
        availabilities: {
          deleteMany: {},
          create: availabilities.map((availabilityId: number) => ({
            availability: { connect: { id: parseInt(availabilityId) } },
          })),
        },
      },
    });

    return new Response(JSON.stringify({ updatedMovie }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong while updating the movie.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
