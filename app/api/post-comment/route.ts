import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
  const data = await request.json();

  const { movieId, userId, commentText, rating } = data;

  try {
    const newComment = await prisma.comment.create({
      data: {
        movieId,
        userId,
        commentText,
        rating,
        status: "UNAPPROVE",
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.log("Error creating comment:", error);
    return NextResponse.error();
  }
}
