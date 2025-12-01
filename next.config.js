/** @type {import('next').NextConfig} */

// Check if deploying to GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  // Only use static export for GitHub Pages
  ...(isGitHubPages ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Only set basePath for GitHub Pages deployment
  basePath: isGitHubPages ? '/avro-docs' : '',
  assetPrefix: isGitHubPages ? '/avro-docs/' : '',
};

module.exports = nextConfig;
