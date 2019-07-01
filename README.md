# webpack4
webpack4学习

## 安装webpack的几种方式
* global(全局):通过webpack index.js运行
* local(项目维度安装):通过npx webpack index.js运行

## 知识点总结
* 避免全局安装webpack（针对多个项目采用不同的webpack版本进行打包的场景），可采用`npx`，具体可参考`http://www.ruanyifeng.com/blog/2019/02/npx.html`
* `npx webpack --config 配置文件名`可指定webpack配置文件（默认为webpack.config.js）
* mode选项(可能的值为none、development或production(默认值))配置用于提供模式配置选项告诉webpack相应的使用其内置的优化。具体可参考`https://webpack.js.org/configuration/mode/#root`
* npm scripts:通过配置package.json里面的scripts字段，直接运行webpack即可。等价于`yarn run bundle -> webpack`
* file-loader可打包处理`eot|svg|ttf|woff`等字体文件

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

### SplitChunksPlugin
* 具体概念可参考`https://juejin.im/post/5af15e895188256715479a9a`

```
splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

### MiniCssExtractPlugin
> 将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
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
    ],
  },
};
```

### OptimizeCSSAssetsPlugin
> webpack5可能会内置CSS 压缩器，webpack4需要自己使用压缩器，可以使用 optimize-css-assets-webpack-plugin 插件。 设置 optimization.minimizer 覆盖webpack默认提供的，确保也指定一个JS压缩器
```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourcMap: true
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  }
}
```

## devtool
### source map
> source map就是对打包生成的代码与源代码的一种映射，主要是为了方便定位问题和排查问题。devtool关键有eval、cheap、module、inline和source-map这几块，具体可参考文档：`https://www.webpackjs.com/configuration/devtool/`
* development环境参考配置: `'cheap-module-eval-source-map'`
* production环境参考配置: `'cheap-module-source-map'`

### webpack-dev-server
> webpack-dev-server提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。具体可参考`https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-webpack-dev-server`

### webpack-dev-middleware
> webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 webpack-dev-server 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求
```
// server.js
// 使用webpack-dev-middleware
// https://www.webpackjs.com/guides/development/#%E4%BD%BF%E7%94%A8-webpack-dev-middleware
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const complier = webpack(config);

const app = express();

app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
}))

app.listen(3000, () => {
  console.log('server is running');
})
```

### Hot Module Replacement
> 模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。
```
// webpack.config.js
...
const webpack = require('webpack');
...
devServer: {
  contentBase: './dist',
  open: true,
  hot: true,
  hotOnly: true
},
plugins: [
  ...
  new webpack.HotModuleReplacementPlugin()
],

```
如果已经通过 HotModuleReplacementPlugin 启用了模块热替换(Hot Module Replacement)，则它的接口将被暴露在 module.hot 属性下面。通常，用户先要检查这个接口是否可访问，然后再开始使用它。
```
// index.js
if (module.hot) {
  module.hot.accept('./library.js', function() {
    // 使用更新过的 library 模块执行某些操作...
  })
}
```

### bundle 分析
> 借助一些官方推荐的可视化分析工具，可对打包后的模块进行分析以及优化
* `webpack-chart`: webpack 数据交互饼图
* `webpack-visualizer`: 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的
* `webpack-bundle-analyzer`: 一款分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户

### Preloading、Prefetching
> prefetch：会等待核心代码加载完成后，页面带宽空闲后再去加载prefectch对应的文件;preload：和主文件一起去加载
* 可以使用谷歌浏览器Coverage工具查看代码覆盖率(ctrl+shift+p > show coverage)
* 使用异步引入js的方式可以提高js的使用率，所以webpack建议我们多使用异步引入的方式，这也是splitChunks.chunks的默认值是"async"的原因
* 使用魔法注释 /* webpackPrefetch: true */ ，这样在主要js加载完，带宽有空闲时，会自动下载需要引入的js
* 使用魔法注释 /* webpackPreload: true */，区别是webpackPrefetch会等到主业务文件加载完，带宽有空闲时再去下载js，而preload是和主业务文件一起加载的

## babel
### babel编译es6、jsx等
* @babel/core babel核心模块
* @babel-preset-env 编译es6等
* @babel/preset-react 转换jsx
* @babel/plugin-transform-runtime 避免polyfill污染全局变量，减少打包体积
* @babel/polyfill es6内置方法和函数转化垫片
* @babel/runtime
```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      }
    }
  ]
}
```
新建.babelrc文件
```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### 按需引入polyfill
在src下的index.js中全局引入@babel/polyfill并写入es6语法，但是这样有一个缺点:
全局引入@babel/polyfill的这种方式可能会导入代码中不需要的polyfill，从而使打包体积更大，修改.babelrc配置
```

`yarn add core-js@2 @babel/runtime-corejs2 --dev`

{
  "presets": [
    [
      "@babel/preset-env", {
      "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```
这就配置好了按需引入。配置了按需引入polyfill后，用到es6以上的函数，babel会自动导入相关的polyfill，这样能大大减少打包编译后的体积。

### babel-runtime和babel-polyfill的区别
> 参考`https://www.jianshu.com/p/73ba084795ce`
* babel-polyfill会”加载整个polyfill库”，针对编译的代码中新的API进行处理，并且在代码中插入一些帮助函数
* babel-polyfill解决了Babel不转换新API的问题，但是直接在代码中插入帮助函数，会导致污染了全局环境，并且不同的代码文件中包含重复的代码，导致编译后的代码体积变大。 Babel为了解决这个问题，提供了单独的包babel-runtime用以提供编译模块的工具函数， 启用插件babel-plugin-transform-runtime后，Babel就会使用babel-runtime下的工具函数
* babel-runtime适合在组件，类库项目中使用，而babel-polyfill适合在业务项目中使用。

## 高级概念
### tree shaking(js)
> tree shaking可清除代码中无用的js代码，只支持import方式引入，不支持commonjs的方式引入
mode是production的无需配置，下面的配置是针对development的
```
// webpack.config.js
optimization: {
  usedExports: true
}


// package.json
"sideEffects": false,
```

### Code Spliting
> 代码分割，和webpack无关
* 同步代码(需在webpack.config.js中配置optimization)
```
// index.js
import _ from 'lodash';

console.log(_.join(['a','b','c'], '****'))

// 在webpack.base.js里做相关配置
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```
* 异步代码(无需任何配置，但需安装`@babel/plugin-syntax-dynamic-import`包)
```
// index.js
function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    const element = document.createElement('div');
    element.innerHTML = _.join(['Jack', 'Cool'], '-');
    return element;
  })
}

getComponent().then(el => {
  document.body.appendChild(el);
})
```

### Caching(缓存)
> 通过使用 output.filename 进行文件名替换，可以确保浏览器获取到修改后的文件。[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 [contenthash] 替换，当文件内容发生变化时，[contenthash]也会发生变化
```
output: {
  filename: "[name].[contenthash].js",
  chunkFilename: '[name].[contenthash].chunk.js'
}
```

### Shimming
> webpack 编译器(compiler)能够识别遵循 ES2015 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(library)可能会引用一些全局依赖（例如 jQuery 中的 $）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 shimming 发挥作用的地方
* shimming 全局变量(第三方库)(ProvidePlugin相当于一个垫片)
```
 const path = require('path');
+ const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
-   }
+   },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
  };
```

* 细粒度 shimming(this指向window)(需要安装imports-loader依赖)
```
 const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window'
+       }
+     ]
+   },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join']
      })
    ]
  };
```

### 环境变量
> webpack命令行环境选项 --env允许您传入任意数量的环境变量。您的环境变量将可访问webpack.config.js。例如，--env.production或--env.NODE_ENV=local
```
webpack --env.NODE_ENV=local --env.production --progress
```
使用环境变量必须对webpack配置进行一项更改。通常，module.exports指向配置对象。要使用该env变量，必须转换module.exports为函数：
```
// webpack.config.js
const path = require('path');

module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
};
```

### library 打包配置
> 除了打包应用程序代码，webpack 还可以用于打包 JavaScript library
用户应该能够通过以下方式访问library:
* ES2015 模块。例如 import library from 'library'
* CommonJS 模块。例如 require('library')
* 全局变量，当通过 script 脚本引入时

我们打包的library中可能会用到一些第三方库，诸如lodash。现在，如果执行 webpack，你会发现创建了一个非常巨大的文件。如果你查看这个文件，会看到 lodash 也被打包到代码中。在这种场景中，我们更倾向于把 lodash 当作 peerDependency。也就是说，用户应该已经将 lodash 安装好。因此，你可以放弃对外部 library 的控制，而是将控制权让给使用 library 的用户。这可以使用 externals 配置来完成：
```
  // webpack.config.js
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js'
-   }
+   },
+   externals: {
+     lodash: {
+       commonjs: 'lodash',
+       commonjs2: 'lodash',
+       amd: 'lodash',
+       root: '_'
+     }
+   }
  };
```
对于用途广泛的 library，我们希望它能够兼容不同的环境，例如 CommonJS，AMD，Node.js 或者作为一个全局变量。为了让你的 library 能够在各种用户环境(consumption)中可用，需要在 output 中添加 library 属性：
```
  // webpack.config.js
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
-     filename: 'library.js'
+     filename: 'library.js',
+     library: 'library'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```
当你在 import 引入模块时，这可以将你的 library bundle 暴露为名为 webpackNumbers 的全局变量。为了让 library 和其他环境兼容，还需要在配置文件中添加 libraryTarget 属性。这是可以控制 library 如何以不同方式暴露的选项。
```
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'library.js',
+     library: 'library',
+     libraryTarget: 'umd'
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```
我们还需要通过设置 package.json 中的 main 字段，添加生成 bundle 的文件路径。
```
// package.json
{
  ...
  "main": "dist/library.js",
  ...
}
```

### PWA 打包配置
> 渐进式网络应用程序(Progressive Web Application - PWA)，是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在离线(offline)时应用程序能够继续运行功能。这是通过使用名为 Service Workers 的网络技术来实现的
添加 workbox-webpack-plugin 插件，并调整 webpack.config.js 文件：
```
npm install workbox-webpack-plugin --save-dev
```
webpack.config.js
```
 const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const WorkboxPlugin = require('workbox-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
-     title: 'Output Management'
+     title: 'Progressive Web Application'
-   })
+   }),
+   new WorkboxPlugin.GenerateSW({
+     // 这些选项帮助 ServiceWorkers 快速启用
+     // 不允许遗留任何“旧的” ServiceWorkers
+     clientsClaim: true,
+     skipWaiting: true
+   })
  ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```
注册Service Worker
```
  import _ from 'lodash';
  import printMe from './print.js';

+ if ('serviceWorker' in navigator) {
+   window.addEventListener('load', () => {
+     navigator.serviceWorker.register('/sw.js').then(registration => {
+       console.log('SW registered: ', registration);
+     }).catch(registrationError => {
+       console.log('SW registration failed: ', registrationError);
+     });
+   });
+ }
```
现在来进行测试。停止服务器并刷新页面。如果浏览器能够支持 Service Worker，你应该可以看到你的应用程序还在正常运行。然而，服务器已经停止了服务，此刻是 Service Worker 在提供服务