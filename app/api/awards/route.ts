import prisma from "@/lib/db";

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
