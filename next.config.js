/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Moved from experimental → top-level
  serverExternalPackages: ['puppeteer'],

  // ✅ Keep webpack config to handle Puppeteer
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },

  // Optional: Explicitly opt out of telemetry (if desired)
  telemetryDisabled: true
};

module.exports = nextConfig;
