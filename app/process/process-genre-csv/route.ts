import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Fungsi untuk memproses CSV dan menambahkan data genre ke dalam database
async function processGenreData(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        const genreNames = row['Genres (Up to 5)']
          ? row['Genres (Up to 5)'].split(',').map((genre: string) => genre.trim())
          : [];

        for (const genreName of genreNames) {
          if (!genreName) continue;

          try {
            // Cek apakah genre sudah ada di database
            let genre = await prisma.genre.findUnique({
              where: { name: genreName },
            });

            // Jika genre belum ada, tambahkan ke database
            if (!genre) {
              await prisma.genre.create({
                data: { name: genreName },
              });
              console.log(`Genre added: ${genreName}`);
            } else {
              console.log(`Genre exists: ${genreName}`);
            }
          } catch (error) {
            console.error(`Error processing genre ${genreName}:`, error);
          }
        }
      })
      .on('end', () => {
        console.log("Finished processing genres.");
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
    // Jalankan fungsi untuk memproses CSV genres
    await processGenreData(csvFilePath);

    return new Response("Genre CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error saat memproses genre CSV:', error);
    return new Response("Failed to process genre CSV", {
      status: 500,
    });
  }
}
