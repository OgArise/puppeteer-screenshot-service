/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 15+ location (correct)
  serverExternalPackages: ['puppeteer'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'puppeteer'];
    }
    return config;
  },
};

module.exports = nextConfig;
