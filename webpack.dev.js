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
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2 // 用于指定在 css-loader 前应用的 loader 的数量
              // modules: true   // 查询参数 modules 会启用 CSS 模块规范
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
  },
  output: {
    filename: "[name].js",
    chunkFilename: '[name].chunk.js'
  }
};

module.exports = merge(baseConfig, devConfig);
