const path = require('path');

const merge = require('webpack-merge');
const common = require('./webpack.common');

const ROOT_PATH = path.resolve(__dirname);

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(ROOT_PATH, 'app/build'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 3000,
    // Docker container has port 0.0.0.0:3000,
    //   but we still acces web app with localhost:3000
    host: 'localhost',
  },
});
