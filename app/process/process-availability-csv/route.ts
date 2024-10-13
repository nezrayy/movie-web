import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Fungsi untuk memproses CSV dan menambahkan data availability dan movie availability ke dalam database
async function processAvailabilityData(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        const movieTitle = row['Title'];
        const availabilityNames = row['Availability']
          ? row['Availability'].split(',').map((availability: string) => availability.trim())
          : [];

        // Cari movie berdasarkan title
        let movie = await prisma.movie.findFirst({
          where: { title: movieTitle }
        });

        // Jika movie tidak ditemukan, reject
        if (!movie) {
          console.error(`Movie ${movieTitle} not found`);
          return;
        }

        for (const availabilityName of availabilityNames) {
          if (!availabilityName) continue;
        
          try {
            // Cek apakah availability sudah ada di database, menggunakan findUnique karena name bersifat unik
            let availability = await prisma.availability.findUnique({
              where: { name: availabilityName },  // Pastikan bahwa name ini adalah kolom unik
            });
        
            // Jika availability belum ada, tambahkan ke database
            if (!availability) {
              availability = await prisma.availability.create({
                data: { name: availabilityName },
              });
              console.log(`Availability added: ${availabilityName}`);
            } else {
              console.log(`Availability exists: ${availabilityName}`);
            }
        
            // Cek apakah relasi MovieAvailability sudah ada
            const existingMovieAvailability = await prisma.movieAvailability.findUnique({
              where: {
                movieId_availabilityId: {
                  movieId: movie.id,
                  availabilityId: availability.id
                }
              }
            });
        
            // Jika relasi belum ada, tambahkan ke tabel MovieAvailability
            if (!existingMovieAvailability) {
              await prisma.movieAvailability.create({
                data: {
                  movieId: movie.id,
                  availabilityId: availability.id
                }
              });
              console.log(`MovieAvailability added: Movie ID ${movie.id}, Availability ID ${availability.id}`);
            } else {
              console.log(`MovieAvailability exists for Movie ID ${movie.id} and Availability ID ${availability.id}`);
            }
          } catch (error) {
            console.error(`Error processing availability ${availabilityName} for movie ${movieTitle}:`, error);
          }
        }              
      })
      .on('end', () => {
        console.log("Finished processing availabilities.");
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
    // Jalankan fungsi untuk memproses CSV availabilities
    await processAvailabilityData(csvFilePath);

    return new Response("Availability CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error saat memproses availability CSV:', error);
    return new Response("Failed to process availability CSV", {
      status: 500,
    });
  }
}
