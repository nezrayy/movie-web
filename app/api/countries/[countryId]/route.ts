import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { countryId: string } }
) {
  const { countryId } = params;
  console.log("Deleting country with ID:", params.countryId); // Debugging

  try {
    await prisma.country.delete({
      where: { id: parseInt(countryId, 10) }, // Hapus komentar berdasarkan countryId
    });

    return NextResponse.json(
      { message: "Country deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { message: "Failed to delete country", error: error.message },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   request: Request,
//   { params }: { params: { countryId: string } }
// ) {
//   const { countryId } = params;

//   try {
//     const existingCountry = await prisma.comment.findUnique({
//       where: { id: parseInt(countryId, 10) },
//     });

//     if (!existingCountry) {
//       return NextResponse.json(
//         { message: "Country not found" },
//         { status: 404 }
//       );
//     }

//     const newStatus =
//       existingComment.status === "APPROVE" ? "UNAPPROVE" : "APPROVE";

//     // Update status di database
//     const updatedComment = await prisma.comment.update({
//       where: { id: parseInt(countryId, 10) },
//       data: { status: newStatus },
//     });

//     return NextResponse.json(updatedComment, { status: 200 });
//   } catch (error) {
//     console.error("Error toggling comment status:", error);
//     return NextResponse.json(
//       { message: "Failed to toggle comment status", error: error.message },
//       { status: 500 }
//     );
//   }
// }
