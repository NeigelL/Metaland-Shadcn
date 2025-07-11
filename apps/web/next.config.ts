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
      }, {
        protocol: 'https',
        hostname: 'www.google-analytics.com'
      }
    ]
  },
    // async rewrites() {

    //   const tenant = process.env.NEXT_TENANT;

    //   const tenants:any = {
    //     'buyer': {
    //       destination: '/buyer',
    //       source: '/buyer/:path*',
    //       value: process.env.NEXT_BUYER_DOMAIN || 'buyer.metaland.properties',
    //     },
    //     'admin': {
    //       destination: '/admin',
    //       source: '/admin/:path*',
    //       value: process.env.NEXT_ADMIN_DOMAIN || 'app.metaland.properties',
    //     },
    //     'agent': {
    //       destination: '/agent',
    //       source: '/agent/:path*',
    //       value: process.env.NEXT_AGENT_DOMAIN || 'agent.metaland.properties',
    //     }
    //   }

    //   let finalRewrites:any = [];

    //   Object.keys(tenants).forEach((key) => {
    //     const tenantConfig = tenants[key];
    //     finalRewrites.push({
    //       source: tenantConfig.source,
    //       has: [
    //         {
    //           type: 'host',
    //           value: tenantConfig.value,
    //         },
    //       ],
    //       destination: tenantConfig.destination,
    //     });
    //     finalRewrites.push({
    //       source: '/:path*',
    //       has: [
    //         {
    //           type: 'host',
    //           value: tenantConfig.value,
    //         },
    //       ],
    //       destination: `${tenantConfig.destination}/:path*`,
    //     });
    //   })
    //   const dynamicRewrites = tenant ?  [
    //     {
    //       source: '/:path*',
    //       destination: `/${tenant}/:path*`,
    //     }
    //   ] : []

    //   return [
    //       ...finalRewrites,
    //       ...dynamicRewrites
    //     ]
    // }
}

export default nextConfig
