/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['cdn1.theimageapi.com','25.media.tumblr.com','cdn2.thecatapi.com','images.dog.ceo','randomfox.ca']
  }

}

module.exports = nextConfig
