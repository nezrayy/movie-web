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
  const sortType = searchParams.get("sortType") === "asc" ? "asc" : "desc"; // Ensure it’s either "asc" or "desc"

  console.log(
    "Fetching comments for movieId:",
    movieId,
    "with sorting:",
    sortOrder,
    sortType
  );

  try {
    const comments = await prisma.comment.findMany({
      where: { movieId: parseInt(movieId, 10) },
      include: { user: true }, // Assuming there is a relationship between comment and user
      orderBy: {
        [sortOrder]: sortType, // Ensure sorting uses valid Prisma syntax
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { movieId, userId, commentText, rating } = data;

    console.log("Received data:", { movieId, userId, commentText, rating });

    // Validate input data
    if (!movieId || !userId || !commentText || rating === undefined) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Check if the user has already commented on this movie
    const existingComment = await prisma.comment.findFirst({
      where: {
        movieId: parseInt(movieId, 10), // Convert movieId to integer
        userId: parseInt(userId, 10), // Convert userId to integer
        status: "APPROVE"
      },
    });

    if (existingComment) {
      return NextResponse.json(
        { message: "You have already commented on this movie." },
        { status: 400 }
      );
    }
    const unapprovedComment = await prisma.comment.findFirst({
      where: {
        movieId: parseInt(movieId, 10), // Convert movieId to integer
        userId: parseInt(userId, 10), // Convert userId to integer
        status: "UNAPPROVE"
      },
    });
    
    if (unapprovedComment) {
      return NextResponse.json(
        { message: "You have already commented on this movie. Wait until admin approve your comment." },
        { status: 400 }
      );
    }
    
    const newComment = await prisma.comment.create({
      data: {
        commentText,
        rating,
        status: "UNAPPROVE",
        movie: {
          connect: { id: parseInt(movieId, 10) }, // Connect movie by its ID
        },
        user: {
          connect: { id: parseInt(userId, 10) }, // Connect user by its ID
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.log("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
