import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortOrder = searchParams.get("sortOrder") || "rating";
  const sortType = searchParams.get("sortType") === "asc" ? "asc" : "desc";

  console.log("Fetching all comments with sorting:", sortOrder, sortType);

  try {
    const validSortColumns = ["rating", "createdAt"]; // Add more valid columns if needed
    if (!validSortColumns.includes(sortOrder)) {
      return NextResponse.json(
        { message: "Invalid sort order" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        movie: true, // Include movie data
      },
      orderBy: {
        [sortOrder]: sortType,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments", error: error.message },
      { status: 500 }
    );
  }
}
