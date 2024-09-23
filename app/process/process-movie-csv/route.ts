import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Fungsi untuk memproses CSV dan menambahkan data movie ke dalam database
async function processMovieData(filePath: string) {
  const movies: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        const title = row['Title'];
        const releaseYear = row['Year'];
        const synopsis = row['Synopsis'];
        const availability = row['Availability'];
        const posterUrl = row['URL Photo'];
        const linkTrailer = row['Trailer(link YT)'];
        const status = 'UNAPPROVE'; // Default status as 'unapprove'
        let countryName = row['Country'];

        // Jika country kosong, isi dengan 'United States'
        if (!countryName || countryName.trim() === '') {
          countryName = 'United States';
        }

        // Cek apakah country sudah ada di database
        let country = await prisma.country.findFirst({
          where: { name: countryName }
        });

        // Jika tidak ada, buat country baru
        if (!country) {
          country = await prisma.country.create({
            data: {
              name: countryName,
              code: countryName.slice(0, 3).toUpperCase(),
            },
          });
        }

        movies.push({
          title,
          releaseYear: parseInt(releaseYear, 10),
          synopsis,
          availability,
          posterUrl,
          linkTrailer,
          status,
          rating: 0.0,  // Default rating, bisa diperbarui nanti berdasarkan komentar
          createdById: 1,  // Harus disesuaikan berdasarkan ID user yang menambahkan (sementara 1)
          countryId: country.id  // Menggunakan countryId yang diperoleh
        });
      })
      .on('end', async () => {
        console.log("Movies yang diproses:", movies);

        // Memasukkan data ke dalam database menggunakan Prisma
        await prisma.movie.createMany({
          data: movies,
          skipDuplicates: true,  // Hindari duplikasi
        });

        resolve();
      })
      .on('error', (error) => {
        console.error("Error saat memproses CSV:", error);
        reject(error);
      });
  });
}

export async function POST(request: Request) {
  const csvFilePath = path.join(process.cwd(), 'public', 'movie-dataset.csv');

  try {
    // Jalankan fungsi untuk memproses CSV
    await processMovieData(csvFilePath);

    return new Response("Movie CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error saat memproses movie CSV:', error);
    return new Response("Failed to process movie CSV", {
      status: 500,
    });
  }
}
