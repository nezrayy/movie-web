import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Hapus komentar yang dibuat oleh pengguna
    await prisma.comment.deleteMany({
      where: {
        userId: userId,
      },
    });

    // Hapus film yang diajukan/dibuat oleh pengguna
    await prisma.movie.deleteMany({
      where: {
        createdById: userId,
      },
    });

    // Hapus user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      { message: "User and related entities deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
