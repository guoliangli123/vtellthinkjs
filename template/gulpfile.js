'use strict'

const path = require('path')

const gulp = require('gulp')
const changed = require('gulp-changed')
const gulpSequence = require('gulp-sequence').use(gulp)
const clean = require('gulp-clean')
const spawn = require('child_process').spawn
const gutil = require('gulp-util')
const rename = require("gulp-rename")
const watch = require('gulp-watch')
const debug = require('gulp-debug')

const through = require('through2')

//忽略异常
const plumber = require('gulp-plumber')

//条件判断
const gulpif = require('gulp-if')
const cache = require('gulp-cached')
const remember = require('gulp-remember')
const filter = require('gulp-filter')

//webpack
const named = require('vinyl-named')
const webpack = require('webpack-stream')

//js相关
const babel = require("gulp-babel")
const uglify = require('gulp-uglify')

//css相关
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const replace = require('gulp-replace')

//浏览器自动刷新
const browserSync = require('browser-sync').create()


//配置文件及变量
const cfg = require('./_scripts/gulp.config')
let serverInstance


//清除任务
gulp.task('clean', () => {
  return gulp.src(cfg.path.dest, { read: false })
    .pipe(clean({ force: true }))
})


gulp.task('build:js', () => {
  const f = filter(cfg.path.filter.js, { restore: true })
  gulp.src(cfg.path.js)
    .pipe(plumber())
    .pipe(cache('scripts'))
    .pipe(f)
    .pipe(named(function(file){
      return file.relative.slice(0,file.relative.lastIndexOf('.'))
    }))
    .pipe(debug({ title: 'webpack编译前:' }))

    .pipe(
      gutil.env.isdebug?
      webpack(require('./_scripts/webpack.development.js')):
      webpack(require('./_scripts/webpack.production.js'))
    )
    
    .pipe(debug({ title: 'webpack编译后:' }))
    
    .pipe(f.restore)
    .pipe(remember('scripts'))
    .pipe(gulp.dest(cfg.path.jsdest))
})

gulp.task('build:css', () => {
  const f = filter([cfg.path.filter.scss], { restore: true })
  return gulp.src(cfg.path.css)
    .pipe(plumber())
    .pipe(changed(cfg.path.cssdest, { extension: '.css' }))
    .pipe(replace('{{ constant.path_prefix }}', '/static'))
    .pipe(f)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(f.restore)
    .pipe(debug({ title: '编译css:' }))
    .pipe(gulp.dest(cfg.path.cssdest))
})

//暂时不对img做压缩，感觉没多大用，还浪费时间
gulp.task('build:img', () => {
  return gulp.src(cfg.path.img)
    .pipe(plumber())
    .pipe(changed(cfg.path.imgdest))
    .pipe(gulp.dest(cfg.path.imgdest))
})

gulp.task('build:html', () => {
  return gulp.src(cfg.path.html)
    .pipe(changed(cfg.path.htmldest))
    .pipe(plumber())
    .pipe(debug({ title: '编译html:' }))
    .pipe(gulp.dest(cfg.path.htmldest))
})

gulp.task('build:weixin',()=>{
  return gulp.src(cfg.path.weixin)
  .pipe(gulp.dest(cfg.path.dest))
})

gulp.task('build', ['clean'], (cb) => {
  gulpSequence(['build:js', 'build:html', 'build:css', 'build:img','build:weixin'], cb)
})


gulp.task('dev', (cb) => {
  gulpSequence('build', 'server', cb)
})

//浏览器自动刷新
gulp.task('browser-sync', ['dev'], (cb) => {
  console.log('构建完毕')
  setTimeout(() => {
    browserSync.init({
      proxy: `http://127.0.0.1:8360/${cfg.debugEntrance}`
    })
  }, 1000)
  cb()
})

gulp.task('browser-reload', () => {
  browserSync.reload()
})


gulp.task('watch', ['browser-sync'], () => {
  gulp.watch([cfg.path.js], ['build:js'])
  gulp.watch([cfg.path.html], ['build:html'])
  gulp.watch([cfg.path.css], ['build:css'])
  
  gulp.watch([`${cfg.path.dest}/**/*`], { debounceDelay: 300 }, ['browser-reload'])
})


//server
gulp.task('server', (cb) => {
  if (serverInstance) serverInstance.kill()
  serverInstance = spawn('node', ['./_scripts/development.js'], { stdio: 'inherit' })
  serverInstance.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
  cb()
})

