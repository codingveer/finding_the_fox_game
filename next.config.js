/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/welcome",
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      "api.thecatapi.com",
      "dog.ceo",
      "cdn1.theimageapi.com",
      "25.media.tumblr.com",
      "cdn2.thecatapi.com",
      "images.dog.ceo",
      "randomfox.ca",
      "27.media.tumblr.com",
      "28.media.tumblr.com",
      "30.media.tumblr.com",
      "**.theimageapi.com",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
