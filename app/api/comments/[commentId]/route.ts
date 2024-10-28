import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;
  console.log("Deleting comment with ID:", params.commentId); // Debugging

  try {
    await prisma.comment.delete({
      where: { id: parseInt(commentId, 10) }, // Hapus komentar berdasarkan commentId
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Failed to delete comment", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
    });

    if (!existingComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const newStatus =
      existingComment.status === "APPROVE" ? "UNAPPROVE" : "APPROVE";

    // Update status di database
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId, 10) },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error toggling comment status:", error);
    return NextResponse.json(
      { message: "Failed to toggle comment status", error: error.message },
      { status: 500 }
    );
  }
}
