// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb', // Batasi ukuran body yang diterima
//     },
//   },
// };

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { image, fileName } = body;

//     if (!image || !fileName) {
//       return new Response(JSON.stringify({ error: 'Missing required parameters - image or fileName' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     // Dekode base64 menjadi buffer
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, 'base64');

//     // Tentukan lokasi penyimpanan file
//     const uploadsDir = path.join(process.cwd(), 'public/uploads');

//     // Pastikan folder 'uploads' sudah ada, atau buat jika belum ada
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }

//     const filePath = path.join(uploadsDir, fileName);

//     // Simpan buffer ke lokasi yang diinginkan
//     fs.writeFileSync(filePath, buffer);

//     // Kirimkan response dengan URL file
//     const fileUrl = `/uploads/${fileName}`;
//     return new Response(JSON.stringify({ fileUrl }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error saving image:', error);
//     return new Response(JSON.stringify({ error: 'Something went wrong while saving the image.' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
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

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      image,
      fileName,
      title,
      alternativeTitle,
      releaseYear,
      synopsis,
      createdById,
      countryId,
      genres,
      actors,
      availabilities,
      linkTrailer,
    } = body;

    if (!image || !fileName || !title || !createdById || !countryId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
    const posterUrl = `/uploads/${fileName}`;

    // Cek apakah id yang digunakan untuk relasi ada
    const createdBy = await prisma.user.findUnique({ where: { id: parseInt(createdById) } });
    if (!createdBy) {
      return new Response(JSON.stringify({ error: 'Invalid `createdById`.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const country = await prisma.country.findUnique({ where: { id: parseInt(countryId) } });
    if (!country) {
      return new Response(JSON.stringify({ error: 'Invalid `countryId`.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Simpan data film menggunakan Prisma
    const movie = await prisma.movie.create({
      data: {
        title,
        alternativeTitle,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        synopsis,
        posterUrl,
        linkTrailer,
        createdBy: { connect: { id: parseInt(createdById) } },
        country: { connect: { id: parseInt(countryId) } },
        genres: genres?.length > 0 ? {
          create: genres.map((genreId) => ({
            genre: { connect: { id: parseInt(genreId) } },
          })),
        } : undefined,
        actors: actors?.length > 0 ? {
          create: actors.map((actorId) => ({
            actor: { connect: { id: parseInt(actorId) } },
          })),
        } : undefined,
        availabilities: availabilities?.length > 0 ? {
          create: availabilities.map((availabilityId) => ({
            availability: { connect: { id: parseInt(availabilityId) } },
          })),
        } : undefined,
      },
    });

    return new Response(JSON.stringify({ movie }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving movie:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong while saving the movie.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
