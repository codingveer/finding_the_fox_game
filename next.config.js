/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['api.thecatapi.com','cdn1.theimageapi.com','25.media.tumblr.com','cdn2.thecatapi.com','images.dog.ceo','randomfox.ca','27.media.tumblr.com','28.media.tumblr.com','localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        pathname: 'theimageapi.com',
        port: '443',
        hostname: '**.theimageapi.com',
      },
      {
        protocol: 'https',
        pathname: 'tumblr.com',
        port: '443',
        hostname: '**.media.tumblr.com',
      },{
        protocol: 'https',
        pathname: 'thecatapi.com',
        port: '443',
        hostname: '**.thecatapi.com',
      }
    ],
  },
}



module.exports = nextConfig
