/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['customwaitlist.com', 'www.customwaitlist.com', 'lh3.googleusercontent.com', 'img.aiwebserverdata.com', 'firebasestorage.googleapis.com', 'localhost:3000', 'avatars.githubusercontent.com'],
  },
  transpilePackages: ["react-tweet"],
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/manifest.json',
        destination: '/api/manifest'
      },
      {
        source: '/sw.js',
        destination: '/api/sw'
      },
      { 
        source: '/(.*)', 
        destination: '/$1' 
      }
    ];
  },
}

const withPWA = require("next-pwa")({
  dest: "public", // sw files will be output to public
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development", // disable PWA in dev
});

module.exports = withPWA(nextConfig);


///