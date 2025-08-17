/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move from experimental to top-level
  serverExternalPackages: ['puppeteer'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },

  // Optional: Explicitly set output for serverless functions
  output: 'standalone'
};

module.exports = nextConfig;
