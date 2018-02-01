const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const cfg = require('./gulp.config');

var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;  //压缩文件
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;//合并文件

//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = [path.resolve(srcDir, 'js', item)];
        }
    });

    return files;
}



module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
      filename: "[name].js",
      path: path.join(ROOT_PATH, "./dist/js/"),
    },
    module: {
        loaders: [
            {
                test: /\.js$/,                   
                loader: 'babel',         //es6语法
                exclude: /node_modules/, // include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
            },
        ],
        noParse: []
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
    },
    plugins: [
        //公共common
        // new CommonsChunkPlugin({
        //     name:'common',
        //     filename: "common.js"
        // })

        //加入了这个插件之后，编译的速度会明显变慢，所以一般只在生产环境启用。
        // new webpack.optimize.uglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),

        //提取css 因为gulp管理css 注销
        // new ExtractTextPlugin('./[name]/index.css', {
        //     allChunks: true
        // })
    ]
};