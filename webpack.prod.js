const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const prodConfig = {
  mode: "production",
  // devtool: 'cheap-module-eval-source-map',  // development
  devtool: "cheap-module-source-map", // production
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
    }),
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader"
        ]
      }
    ]
  }
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
