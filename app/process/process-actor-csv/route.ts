import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

async function processActors(filePath: string) {
  const actorsData: { name: string; countryId: number; movieId: number }[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        const movieTitle = row['Title'];
        const countryName = row['Country'];
        const actors = row['Actor (Up to 9)'].split(',').map((actor: string) => actor.trim());

        // Cari country berdasarkan nama country
        let country = await prisma.country.findFirst({
          where: { name: countryName }
        });

        // Jika country tidak ditemukan, reject
        if (!country) {
          reject(`Country ${countryName} not found`);
          return;
        }

        // Cari movie berdasarkan title
        let movie = await prisma.movie.findFirst({
          where: { title: movieTitle }
        });

        // Jika movie tidak ditemukan, reject
        if (!movie) {
          reject(`Movie ${movieTitle} not found`);
          return;
        }

        // Loop semua actor dan tambahkan data actor
        for (let actorName of actors) {
          // Cek apakah actor sudah ada di database
          let existingActor = await prisma.actor.findFirst({
            where: { name: actorName }
          });

          // Jika actor belum ada, masukkan actor baru
          if (!existingActor) {
            await prisma.actor.create({
              data: {
                name: actorName,
                countryId: country.id,
                movies: {
                  create: {
                    movieId: movie.id
                  }
                }
              }
            });
          } else {
            // Jika actor sudah ada, tambahkan relasi ke movie yang sedang diproses
            await prisma.movieActor.create({
              data: {
                actorId: existingActor.id,
                movieId: movie.id
              }
            });
          }
        }
      })
      .on('end', async () => {
        console.log("Actors processing completed.");
        resolve();
      })
      .on('error', (error) => {
        console.error("Error processing actors CSV:", error);
        reject(error);
      });
  });
}

// Jalankan fungsi proses actor
export async function POST(request: Request) {
  const csvFilePath = path.join(process.cwd(), 'public', 'movie-dataset.csv'); // Ubah sesuai path file CSV Anda

  try {
    await processActors(csvFilePath);

    return new Response("Actors CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing actors CSV:', error);
    return new Response("Failed to process actors CSV", {
      status: 500,
    });
  }
}
