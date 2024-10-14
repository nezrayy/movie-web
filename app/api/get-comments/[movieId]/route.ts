import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  const { movieId } = params;
  const { searchParams } = new URL(request.url);
  const sortOrder = searchParams.get("sortOrder") || "rating";
  const sortType = searchParams.get("sortType") || "desc";

  console.log(
    "Fetching reviews for movieId:",
    movieId,
    "with sorting:",
    sortOrder,
    sortType
  );

  try {
    const reviews = await prisma.comment.findMany({
      where: { movieId: parseInt(movieId, 10) },
      include: { user: true },
      orderBy: {
        [sortOrder]: sortType,
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", error: error.message },
      { status: 500 }
    );
  }
}
