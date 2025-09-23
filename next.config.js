/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Live Server compatibility
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Optional: Add trailing slash for better static hosting
  trailingSlash: true,
  
  // Optional: Custom asset prefix if needed
  // assetPrefix: './',
}

module.exports = nextConfig