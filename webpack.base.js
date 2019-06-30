const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CleanWebpackPlugin(),
    // new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin()
  ],
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