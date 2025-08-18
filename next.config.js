/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer-core', 'chrome-aws-lambda'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('puppeteer-core', 'chrome-aws-lambda');
    }
    return config;
  },
};
module.exports = nextConfig;
