import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db'; // Import Prisma client Anda

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Batasi ukuran body yang diterima
    },
  },
};

export async function PUT(req: any) {
  try {
    const body = await req.json();
    const {
      id, // Tambahkan id dari movie yang ingin di-update
      image,
      fileName,
      title,
      alternativeTitle,
      releaseYear,
      synopsis,
      countryId,
      genres,
      actors,
      availabilities,
      linkTrailer,
    } = body;

    if (!id || !title || !countryId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let posterUrl = undefined;

    if (image && fileName) {
      // Dekode base64 menjadi buffer
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      // Tentukan lokasi penyimpanan file
      const uploadsDir = path.join(process.cwd(), 'public/uploads');

      // Pastikan folder 'uploads' sudah ada, atau buat jika belum ada
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);

      // Simpan buffer ke lokasi yang diinginkan
      fs.writeFileSync(filePath, buffer);

      // URL file untuk poster film
      posterUrl = `/uploads/${fileName}`;
    }

    // Cek apakah id yang digunakan untuk relasi ada
    const country = await prisma.country.findUnique({ where: { id: parseInt(countryId) } });
    if (!country) {
      return new Response(JSON.stringify({ error: 'Invalid `countryId`.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update data film menggunakan Prisma
    const updatedMovie = await prisma.movie.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        alternativeTitle,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        synopsis,
        posterUrl, // Poster hanya diperbarui jika ada
        linkTrailer,
        country: { connect: { id: parseInt(countryId) } },
        genres: genres?.length > 0 ? {
          set: [], // Hapus relasi lama
          create: genres.map((genreId: any) => ({
            genre: { connect: { id: parseInt(genreId) } },
          })),
        } : {
          set: [], // Hapus relasi lama jika genres tidak disediakan
        },
        actors: actors?.length > 0 ? {
          set: [], // Hapus relasi lama
          create: actors.map((actorId: any) => ({
            actor: { connect: { id: parseInt(actorId) } },
          })),
        } : {
          set: [], // Hapus relasi lama jika actors tidak disediakan
        },
        availabilities: availabilities?.length > 0 ? {
          set: [], // Hapus relasi lama
          create: availabilities.map((availabilityId: any) => ({
            availability: { connect: { id: parseInt(availabilityId) } },
          })),
        } : {
          set: [], // Hapus relasi lama jika availabilities tidak disediakan
        },
      },
    });

    return new Response(JSON.stringify({ updatedMovie }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong while updating the movie.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
