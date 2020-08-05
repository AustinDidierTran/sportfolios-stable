const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
  devServer: {
    writeToDisk: true,
  },
  entry: {
    app: path.resolve(ROOT_PATH, 'app/src/index.jsx'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.module\.(sc|sa|c)ss$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.(sc|sa|c)ss$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT_PATH, 'app/public/index.html'),
    }),
    new InjectManifest({
      maximumFileSizeToCacheInBytes: 5000000,
      swSrc: path.resolve(
        __dirname,
        './service-worker/serviceWorkerWorkbox.js',
      ),
      swDest: 'service-worker.js',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(ROOT_PATH, 'app/public') }],
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(ROOT_PATH, 'app/build'),
    publicPath: '/',
  },
};
