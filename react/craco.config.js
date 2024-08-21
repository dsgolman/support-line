const path = require('path');

module.exports = {
  webpack: {
    alias: {
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      buffer: path.resolve(__dirname, 'node_modules/buffer/'),
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        // Add other fallbacks here if needed
      };

      return webpackConfig;
    },
  },
};
