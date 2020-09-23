const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const CompressionPlugin = require('compression-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new InjectManifest({
      maximumFileSizeToCacheInBytes: 5000000,
      swSrc: path.resolve(
        __dirname,
        './service-worker/serviceWorkerWorkbox.js',
      ),
      swDest: 'service-worker.js',
    }),
    new CompressionPlugin(),
  ],
});
