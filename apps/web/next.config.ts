/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'metaland-prod.s3.ap-southeast-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },{
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          port: '',
          pathname: '/**/**',
        }
      ],
    },
  }

module.exports = nextConfig;