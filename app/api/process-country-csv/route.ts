import prisma from '@/lib/db'; // Mengimport Prisma Client
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Fungsi untuk memproses CSV dan menyimpan negara ke database
async function processCountryData(filePath: string) {
  const countries: { name: string }[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const countryName = row['Country'];

        // Memastikan bahwa nama dan kode negara sudah ada sebelum dimasukkan
        if (countryName && !countries.some(c => c.name === countryName)) {
          countries.push({ name: countryName });
        }
      })
      .on('end', async () => {
        console.log("Data negara yang diproses:", countries);

        await prisma.country.createMany({
          data: countries,
          skipDuplicates: true, 
        });

        resolve();
      })
      .on('error', (error) => {
        console.error("Error saat memproses CSV:", error);
        reject(error);
      });
  });
}

// POST handler untuk memproses CSV
export async function POST(request: Request) {
  const csvFilePath = path.join(process.cwd(), 'public', 'movie-dataset.csv'); // Sesuaikan path file CSV di folder "public"

  try {
    // Jalankan fungsi untuk memproses CSV
    await processCountryData(csvFilePath);

    return new Response("Country CSV processing completed", {
      status: 200,
    });
  } catch (error) {
    console.error('Error saat memproses country CSV:', error);
    return new Response("Failed to process country CSV", {
      status: 500,
    });
  }
}
