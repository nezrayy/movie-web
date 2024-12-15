import prisma from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: { movieId: string } }
) {
  try {
    const { movieId } = context.params;

    const movieIdNumber = parseInt(movieId, 10);

    if (isNaN(movieIdNumber)) {
      return new Response(JSON.stringify({ message: "Invalid movie ID" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieIdNumber,
      },
    });

    if (!movie) {
      return new Response(JSON.stringify({ message: "Movie not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const body = await request.json();
    const { status } = body;

    await prisma.movie.update({
      where: {
        id: movieIdNumber,
      },
      data: {
        status,
      },
    });

    return new Response(JSON.stringify({ message: "Movie status updated" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating movie status:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
