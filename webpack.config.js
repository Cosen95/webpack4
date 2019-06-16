const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  // devtool: 'cheap-module-eval-source-map',  // development
  // devtool: 'cheap-module-source-map',   // production
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    open: true
  },
  module: {
    rules: [{
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name]_[hash].[ext]',
          outputPath: 'images/',
          limit: 204800
        }
      }
    }, {
      test: /\.(eot|svg|ttf|woff)$/,
      use: {
        loader: 'file-loader',
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,  // 用于指定在 css-loader 前应用的 loader 的数量
            // modules: true   // 查询参数 modules 会启用 CSS 模块规范
          }
        },
          'sass-loader',
          'postcss-loader'
        ],
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin()
  ],
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}