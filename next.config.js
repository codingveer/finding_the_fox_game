/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['api.thecatapi.com','cdn1.theimageapi.com','25.media.tumblr.com','cdn2.thecatapi.com','images.dog.ceo','randomfox.ca','27.media.tumblr.com','28.media.tumblr.com','localhost']
  }

}

module.exports = nextConfig
