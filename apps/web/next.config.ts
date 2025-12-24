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
      }, {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**/**',
      }, {
        protocol: 'https',
        hostname: 'www.google-analytics.com',
        port: '',
        pathname: '/**/**',
      }, {
        protocol: 'https',
        hostname: 'metaland-socket.onrender.com',
        port: '',
        pathname: '/**/**',
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_ADMIN_DOMAIN || process.env.NEXT_REALTY_DOMAIN || process.env.NEXT_AUTH_URL || process.env.NEXT_BUYER_DOMAIN || process.env.NEXT_AGENT_DOMAIN || process.env.NEXT_SALES_MANAGER_DOMAIN || "" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
        ],
      },
    ];
  },
}

export default nextConfig
