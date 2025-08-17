/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  }
};

module.exports = nextConfig;