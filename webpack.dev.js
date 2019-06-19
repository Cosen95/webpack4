const webpack = require("webpack");
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const devConfig = {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',  // development
  // devtool: 'cheap-module-source-map',   // production
  devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,
    hotOnly: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    usedExports: true
  },
};

module.exports = merge(baseConfig, devConfig);
