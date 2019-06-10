# webpack4
webpack4学习

## 安装webpack的几种方式
* global(全局):通过webpack index.js运行
* local(项目维度安装):通过npx webpack index.js运行
* npm scripts:通过配置package.json里面的scripts字段，直接运行webpack即可。等价于`yarn run bundle -> webpack`

## 知识点总结
* 避免全局安装webpack（针对多个项目采用不同的webpack版本进行打包的场景），可采用`npx`，具体可参考`http://www.ruanyifeng.com/blog/2019/02/npx.html`
* `npx webpack --config 配置文件名`可指定webpack配置文件（默认为webpack.config.js）
* mode选项(可能的值为none、development或production(默认值))配置用于提供模式配置选项告诉webpack相应的使用其内置的优化。具体可参考`https://webpack.js.org/configuration/mode/#root`
