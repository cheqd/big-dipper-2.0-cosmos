const nextTranslate = require('next-translate');

const moduleExports = nextTranslate({
  poweredByHeader: false,
  basePath: '',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
