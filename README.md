# webpack4
webpack4学习

## 安装webpack的几种方式
* global(全局):通过webpack index.js运行
* local(项目维度安装):通过npx webpack index.js运行
* npm scripts:通过配置package.json里面的scripts字段，直接运行webpack即可。等价于`yarn run bundle -> webpack`
* file-loader可打包处理`eot|svg|ttf|woff`等字体文件

## 知识点总结
* 避免全局安装webpack（针对多个项目采用不同的webpack版本进行打包的场景），可采用`npx`，具体可参考`http://www.ruanyifeng.com/blog/2019/02/npx.html`
* `npx webpack --config 配置文件名`可指定webpack配置文件（默认为webpack.config.js）
* mode选项(可能的值为none、development或production(默认值))配置用于提供模式配置选项告诉webpack相应的使用其内置的优化。具体可参考`https://webpack.js.org/configuration/mode/#root`

## entry(入口)
### 单一入口
```
// webpack.config.js

const config = {
  entry: {
    main: './src/index.js'
  }
};
```

### 多入口
```
// webpack.config.js

const config = {
  entry: {
    main: './src/index.js',
    sub: './src/sub.js'
  }
};
```

## output(输出)
### 默认配置
```
// webpack.config.js
const path = require('path');
...

const config = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

module.exports = config;

```

### 多个入口起点
> 如果配置创建了多个单独的 "chunk"（例如，使用多个入口起点或使用像 CommonsChunkPlugin 这样的插件），则应该使用占位符(substitutions)来确保每个文件具有唯一的名称。
```
// webpack.config.js
const path = require('path');
{
  entry: {
    main: './src/index.js',
    sub: './src/sub.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}

// 写入到硬盘：./dist/main.js, ./dist/sub.js
```

### 高级进阶
> 使用cdn
```
// webpack.config.js
const path = require('path');
{
  entry: {
    main: './src/index.js',
    sub: './src/sub.js'
  },
  output: {
    publicPath: 'http://cdn.example.com'
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}

// 写入到http://cdn.example.com/main.js, http://cdn.example.com/sub.js
```

## loaders
> webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。

### file-loader
* file-loader可以解析项目中的url引入（不仅限于css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。
* 默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名。
```
rules: [{
  test: /\.(jpg|png|gif)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name]_[hash].[ext]',
      outputPath: 'images/',
    }
  }
}]
```
### url-loader
* url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
* url-loader把资源文件转换为URL，file-loader也是一样的功能。不同之处在于url-loader更加灵活，它可以把小文件转换为base64格式的URL，从而减少网络请求次数。url-loader依赖file-loader。
```
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
}]
```

### css-loader
* 只负责加载css模块,不会将加载的css样式应用到html
* importLoaders用于指定在 css-loader 前应用的 loader 的数量
* 查询参数 modules 会启用 CSS 模块规范
```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    }
  ]
}
```

### style-loader
* 负责将css-loader加载到的css样式动态的添加到html-head-style标签中
* 一般建议将 style-loader 与 css-loader 结合使用

### sass-loader
#### 安装
`yarn add sass-loader node-sass webpack --dev`
* node-sass 和 webpack 是 sass-loader 的 peerDependency，因此能够精确控制它们的版本。
* loader执行顺序：从下至上，从右至左
* 通过将 style-loader 和 css-loader 与 sass-loader 链式调用，可以立刻将样式作用在 DOM 元素。
```
// webpack.config.js
module.exports = {
...
module: {
  rules: [{
    test: /\.scss$/,
    use: [{
        loader: "style-loader" // 将 JS 字符串生成为 style 节点
    }, {
        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
    }, {
        loader: "sass-loader" // 将 Sass 编译成 CSS
    }]
  }]
}
};
```

### postcss-loader
* webpack4中使用postcss-loader代替autoprefixer，给css3样式加浏览器前缀。具体可参考`https://blog.csdn.net/u014628388/article/details/82593185`
```
// webpack.config.js
 {
  test: /\.scss$/,
  use: [
    'style-loader',
      'css-loader',
      'sass-loader',
      'postcss-loader'
    ],
}

//postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
    ],
};

```

## plugins
> plugin可以在webpack运行到某个时刻的时候，帮你做一些事情
### HtmlWebpackPlugin
* HtmlWebpackPlugin会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html文件中
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
...
plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
};
```
### clean-webpack-plugin
* clean-webpack-plugin插件用来清除残留打包文件，特别是文件末尾添加了hash之后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多。
* 新版本中的clean-webpack-plugin仅接受一个对象，默认不需要传任何参数。具体可参考`https://blog.csdn.net/qq_23521659/article/details/88353708`
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
...
plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
```

## devtool
> source map就是对打包生成的代码与源代码的一种映射，主要是为了方便定位问题和排查问题。devtool关键有eval、cheap、module、inline和source-map这几块，具体可参考文档：`https://www.webpackjs.com/configuration/devtool/`
* development环境参考配置: `'cheap-module-eval-source-map'`
* production环境参考配置: `'cheap-module-source-map'`
