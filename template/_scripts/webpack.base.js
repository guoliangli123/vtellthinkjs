// const cfg = require('./gulp.config');

module.exports = {
  // entry: cfg.webpackEntry,
  output: {
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',         //es6语法
        exclude: /node_modules/, // include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
        // query: {
        //   presets: ['es2015'] //也可以通过外部配置文件.babelrc
        // }
      },
    ]
  }
}