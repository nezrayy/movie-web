import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendSuspensionEmail } from "@/utils/sendSuspensionEmail"; // Pastikan path ke utilitas email benar

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Hapus semua data terkait user secara manual sebelum menghapus user
    await prisma.comment.deleteMany({
      where: { userId: userId },
    });

    await prisma.movie.deleteMany({
      where: { createdById: userId },
    });

    await prisma.account.deleteMany({
      where: { userId: userId },
    });

    await prisma.session.deleteMany({
      where: { userId: userId },
    });

    // Setelah semua data terkait dihapus, barulah hapus user
    await prisma.user.delete({
      where: { id: userId },
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

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log("Received body data:", body);
    const { role, status } = body;

    if (!role && !status) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update user di database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    console.log("User successfully updated:", updatedUser);

    // Kirim email jika status diubah menjadi `SUSPENDED`
    if (status === "SUSPENDED" && updatedUser.email) {
      // Tambahkan cek untuk memastikan email bukan null
      try {
        await sendSuspensionEmail(updatedUser.email);
        console.log(`Suspension email sent to ${updatedUser.email}`);
      } catch (emailError) {
        console.error("Error sending suspension email:", emailError);
      }
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
