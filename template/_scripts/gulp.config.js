const path = require('path');
const fs = require('fs');

let cwd = path.resolve(`${__dirname}`,'../','./src');


exports.path = {
  // js: `${cwd}/view/js/**/*.js`,
  js: [`${cwd}/view/js/**/*.js`],
  // html: `${cwd}/view/pages/*.html`,
  html: `${cwd}/view/pages/**/*.html`,
  css:[`${cwd}/view/css/**/*.css`,`${cwd}/view/css/**/*.scss`],
  img:[`${cwd}/view/images/*`],
  weixin:`${cwd}/view/*.txt`,

  //dest
  dest: `www`,
  jsdest: `www/static/js`,
  htmldest: `www/views`,
  cssdest: `www/static/css`,
  libjsdest: `www/static/js/lib`,
  imgdest:`www/static/images`,

  cwd: `${cwd}/view`,

  filter: {
    scss: '**/*.scss',
    js: ['**/*.js', `!**/lib/**`,'!**/utils/**'],
  }
}


exports.debugEntrance = '';