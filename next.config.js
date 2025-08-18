/** @type {import('next').NextConfig} */
module.exports = {
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  webpack: (config, { isServer }) => {
    if (isServer) config.externals.push('puppeteer-core', '@sparticuz/chromium');
    return config;
  },
};
