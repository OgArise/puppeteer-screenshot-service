// next.config.js
module.exports = {
  serverExternalPackages: ['puppeteer'],
  webpack: (config, {isServer}) => {
    if (isServer) {
      config.externals.push('puppeteer');
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/render-png',
        destination: '/api/route',
      },
    ];
  },
};
