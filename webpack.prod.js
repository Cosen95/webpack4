const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const prodConfig = {
  mode: "production",
  // devtool: 'cheap-module-eval-source-map',  // development
  devtool: 'cheap-module-source-map',   // production
  // devServer: {
  //   contentBase: "./dist",
  //   open: true,
  //   hot: true,
  //   hotOnly: true
  // },
  // optimization: {
  //   usedExports: true
  // },
};

module.exports = merge(baseConfig, prodConfig);
