'use strict';

const path = require('path');

const gulp = require('gulp');
const changed = require('gulp-changed');
const gulpSequence = require('gulp-sequence').use(gulp);
const clean = require('gulp-clean');
const spawn = require('child_process').spawn;
const gutil = require('gulp-util');
const rename = require("gulp-rename");
const watch = require('gulp-watch');
const debug = require('gulp-debug');

const cache = require('gulp-cached');
const remember = require('gulp-remember');
const filter = require('gulp-filter');

//webpack
const named = require('vinyl-named');
const webpack = require('webpack-stream');

//js相关
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');

//css相关
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');

//浏览器自动刷新
const browserSync = require('browser-sync').create();


//配置文件及变量
const cfg = require('./gulp.config');
let serverInstance;


//清除任务
gulp.task('clean', () => {
  return gulp.src(cfg.path.dest, { read: false })
    .pipe(clean({ force: true }));
});


//拷贝任务
// gulp.task('copy:js',()=>{
//   return gulp.src(cfg.path.libjs)
//   .pipe(changed(cfg.path.libjsdest))
//   .pipe(gulp.dest(cfg.path.libjsdest))
// })


gulp.task('build:js', () => {
  const f = filter(cfg.path.filter.js, { restore: true });
  return gulp.src(cfg.path.js)
    .pipe(cache('scripts'))
    .pipe(f)
    .pipe(named())
    .pipe(debug({title: 'webpack编译前:'}))
    .pipe(webpack({
      devtool: 'source-map',
      entry:cfg.webpackEntry,
      output: {
        filename: '[name].js',
      },
      module: {
        loaders: [
          {
            test: /\.js?$/,
            loader: 'babel-loader',         //es6语法
            exclude: /node_modules/, // include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
            query: {
              presets: ['es2015'] //也可以通过外部配置文件.babelrc
            }
          },
        ]
      }
    }, null, function (err, stats) {
      /* Use stats to do more things if needed */
      if (err) throw new gutil.PluginError("webpack:build-js", err);
      gutil.log("[webpack:build-js]", stats.toString({
        colors: true
      }));
    }))
    .pipe(debug({title: 'webpack编译:'}))
    .pipe(f.restore)
    .pipe(remember('scripts'))
    .pipe(gulp.dest(cfg.path.jsdest));
});

gulp.task('build:css', () => {
  const f = filter([cfg.path.filter.scss], { restore: true });
  return gulp.src(cfg.path.css)
    .pipe(changed(cfg.path.cssdest,{extension:'.css'}))
    .pipe(replace('{{ constant.path_prefix }}', '/static'))
    .pipe(f)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(f.restore)
    .pipe(debug({title: '编译:'}))
    .pipe(gulp.dest(cfg.path.cssdest));
});

//暂时不对img做压缩，感觉没多大用，还浪费时间
gulp.task('build:img', () => {
  return gulp.src(cfg.path.img)
  .pipe(debug({title: '编译:'}))
  .pipe(changed(cfg.path.imgdest))
  .pipe(gulp.dest(cfg.path.imgdest));
});

gulp.task('build:html', () => {
  return gulp.src(cfg.path.html)
    .pipe(changed(cfg.path.htmldest))
    .pipe(rename(function (path) {
      path.dirname = ''
    }))
    .pipe(gulp.dest(cfg.path.htmldest));
});

gulp.task('build', ['clean'], (cb) => {
  gulpSequence(['build:js', 'build:html', 'build:css','build:img'], cb);
});


gulp.task('dev', (cb) => {
  gulpSequence('build', 'server', cb);
});

//浏览器自动刷新
gulp.task('browser-sync', ['dev'], (cb) => {
  console.log('构建完毕');
  setTimeout(() => {
    browserSync.init({
      proxy: `http://127.0.0.1:8360/${cfg.debugEntrance}`
    });
  }, 1000);
  cb();
});

gulp.task('browser-reload', () => {
  browserSync.reload();
});

// gulp.task('watch', () => {
gulp.task('watch', ['browser-sync'], () => {
  gulp.watch([cfg.path.js], ['build:js']);
  gulp.watch([cfg.path.html], ['build:html']);
  gulp.watch([cfg.path.css], ['build:css']);
  
  // options The options object passed in.
  //   interval {integer} Interval to pass to fs.watchFile
  //   debounceDelay {integer} Delay for events called in succession for the same file/event in milliseconds
  //   mode {string} Force the watch mode. Either 'auto' (default), 'watch' (force native events), or 'poll' (force stat polling).
  //   cwd {string} The current working directory to base file patterns from. Default is process.cwd().
  // gulp.watch([cfg.path.dest],{debounceDelay:100},['browser-reload']);
  gulp.watch([`${cfg.path.dest}/**/*`],{debounceDelay:300},['browser-reload']);
  gulp.watch([`${cfg.path.dest}/**/*`],{debounceDelay:300},function(event){
    console.log(event);
  });
});


//server
gulp.task('server', (cb) => {
  if (serverInstance) serverInstance.kill();
  serverInstance = spawn('node', ['./development.js'], { stdio: 'inherit' })
  serverInstance.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
  cb();
});

