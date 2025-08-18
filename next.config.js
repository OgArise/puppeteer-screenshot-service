/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Required for Puppeteer
  serverExternalPackages: ['puppeteer'],

  // ✅ Custom webpack config to handle Puppeteer
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },

  // Optional: Disable telemetry (correct way)
  // Run `npx next telemetry disable` in your project root instead
};

module.exports = nextConfig;