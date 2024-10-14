import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
    const data = await request.json();
    const { movieId, userId, commentText, rating } = data;
  
    console.log("Received data:", { movieId, userId, commentText, rating });
  
    // Validasi input
    if (!movieId || !userId || !commentText || rating === undefined) {
      console.log("Invalid input data");
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }
  
    try {
      // Cek apakah user sudah pernah memberi komentar untuk film ini
      const existingComment = await prisma.comment.findFirst({
        where: {
          movieId: movieId,
          userId: parseInt(userId, 10),
        },
      });
  
      if (existingComment) {
        return NextResponse.json(
          { message: "You have already commented on this movie" },
          { status: 400 }
        );
      }
  
      // Jika belum ada, buat komentar baru
      const newComment = await prisma.comment.create({
        data: {
          commentText,
          rating,
          status: "UNAPPROVE",
          movie: {
            connect: { id: movieId },
          },
          user: {
            connect: { id: parseInt(userId, 10) },
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
  
