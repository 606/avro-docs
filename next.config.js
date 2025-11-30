/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export in production (for GitHub Pages)
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/avro-docs' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/avro-docs/' : '',
};

module.exports = nextConfig;
