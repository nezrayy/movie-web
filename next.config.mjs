export default {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push("react-dom/client");
    return config;
  },
  server: {
    port: 80,
  },
  images: {
    unoptimized: true,
  },
};
// const nextConfig = {
//   // images: {
//   //   remotePatterns: [
//   //     {
//   //       protocol: "http",
//   //       hostname: "*", // Mengizinkan semua domain dengan http
//   //     },
//   //     {
//   //       protocol: "https",
//   //       hostname: "*", // Mengizinkan semua domain dengan https
//   //     },
//   //   ],
//   // },
// };

// export default nextConfig;
