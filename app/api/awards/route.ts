import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const awards = await prisma.award.findMany({
      include: {
        movie: true, 
        country: true, 
      },
    });
    
    return new Response(JSON.stringify(awards), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching awards:", error);
    return new Response("Something went wrong while fetching awards.", {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Parsing input dan memastikan semua field sudah diubah ke tipe yang sesuai
    const awardData = {
      name: body.name,
      description: body.description,
      awardYear: parseInt(body.year, 10),
      countryId: parseInt(body.country, 10),
      movieId: parseInt(body.movie, 10) 
    };

    // Buat entri baru di database
    const newAward = await prisma.award.create({
      data: awardData,
    });

    return NextResponse.json(newAward, { status: 201 });
  } catch (error) {
    console.error("Error creating award:", error);
    return new NextResponse("Something went wrong while creating award.", { status: 500 });
  }
}
