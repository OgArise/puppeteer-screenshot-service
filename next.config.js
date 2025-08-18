/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['playwright'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('playwright');
    }
    return config;
  },
};

module.exports = nextConfig;