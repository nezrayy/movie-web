// pages/api/get-movie-details/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/db"; // Pastikan prisma sudah diinisialisasi dengan benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // Dapatkan ID dari query URL

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        actors: true,
        genres: true,
      },
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie details' });
  }
}
