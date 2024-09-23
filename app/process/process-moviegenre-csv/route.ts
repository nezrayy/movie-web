import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Fungsi untuk memproses CSV dan menambahkan relasi movie dengan genre ke dalam database
async function processMovieGenreData(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        const movieTitle = row['Title']; // Ambil title movie dari CSV
        const genres = row['Genres (Up to 5)']; // Ambil genre dari CSV, ini bisa berupa string yang dipisah koma, misalnya "Action, Drama"

        // Cari movie berdasarkan title
        const movie = await prisma.movie.findFirst({
          where: { title: movieTitle },
        });

        if (!movie) {
          console.error(`Movie not found: ${movieTitle}`);
          return;
        }

        // Pecah genres menjadi array
        const genreNames = genres.split(',').map((genre: any) => genre.trim());

        for (const genreName of genreNames) {
          // Cari genre berdasarkan nama
          const genre = await prisma.genre.findFirst({
            where: { name: genreName },
          });

          if (!genre) {
            console.error(`Genre not found: ${genreName}`);
            continue;
          }

          // Cek apakah relasi antara movie dan genre sudah ada di tabel moviegenre
          const existingRelation = await prisma.movieGenre.findFirst({
            where: {
              movieId: movie.id,
              genreId: genre.id,
            },
          });

          // Jika relasi belum ada, buat relasi baru
          if (!existingRelation) {
            await prisma.movieGenre.create({
              data: {
                movieId: movie.id,
                genreId: genre.id,
              },
            });
            console.log(`Added relation between movie "${movieTitle}" and genre "${genreName}"`);
          } else {
            console.log(`Relation already exists for movie "${movieTitle}" and genre "${genreName}"`);
          }
        }
      })
      .on('end', async () => {
        console.log("Movie-Genre relations processing completed.");
        resolve();
      })
      .on('error', (error) => {
        console.error("Error processing CSV:", error);
        reject(error);
      });
  });
}

export async function POST(request: Request) {
  const csvFilePath = path.join(process.cwd(), 'public', 'movie-dataset.csv');

  try {
    // Proses CSV dan masukkan relasi ke database
    await processMovieGenreData(csvFilePath);

    return new Response("Movie-Genre CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing Movie-Genre CSV:', error);
    return new Response("Failed to process Movie-Genre CSV", {
      status: 500,
    });
  }
}
