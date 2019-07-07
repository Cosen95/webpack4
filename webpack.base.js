const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');

const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.html"
  }),
  new CleanWebpackPlugin(),
  new webpack.ProvidePlugin({
    _: "lodash",
    $: "jquery"
  })
];

const files = fs.readdirSync(path.resolve(__dirname, './dll'));
files.forEach(file => {
  if(/.*\.dll.js/.test(file)) {
    plugins.push(new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, './dll', file)
    }))
  }
  if(/.*\.manifest.json/.test(file)) {
    plugins.push(new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, './dll', file)
    }))
  }
})

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
        }],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 204800
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff)$/,
        use: {
          loader: "file-loader"
        }
      },
    ]
  },
  plugins,
  optimization: {
      usedExports: true,
      splitChunks: {
        chunks: "all",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
            },
        default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
            }
        }
    }
  },
  output: {
    // publicPath: "./",
    path: path.resolve(__dirname, "dist")
  }
}