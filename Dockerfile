# Gunakan base image Node.js versi 18.17.0 atau lebih tinggi
FROM node:18.17.0

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json dari folder proyek
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

# Instal ulang dependensi di dalam container
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . . 

# Hapus bcrypt dan install ulang untuk platform Linux
RUN npm rebuild bcrypt --build-from-source

# Tambahkan konfigurasi TypeScript untuk mengabaikan error saat build
RUN echo "export default { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, experimental: { missingSuspenseWithCSRBailout: false, }, reactStrictMode: false };" > next.config.mjs

# Copy prisma folder
COPY ./prisma ./prisma

# Run prisma generate
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build aplikasi Next.js tanpa linting dan mengabaikan TypeScript error
RUN npm run build

# Ekspos port 3000 untuk akses aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
