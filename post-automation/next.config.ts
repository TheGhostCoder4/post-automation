/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⛔ Tell Vercel to skip linting during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
