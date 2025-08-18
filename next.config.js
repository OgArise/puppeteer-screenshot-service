<<<<<<< HEAD
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
=======
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
>>>>>>> 051ab7cafb39e3b477dec842feb37f8f60e11a80
