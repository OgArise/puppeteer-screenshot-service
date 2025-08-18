// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },

  // Reduce noise
  logging: 'off',
  // Optional: disable telemetry
  telemetryDisabled: true,
};

module.exports = nextConfig;
